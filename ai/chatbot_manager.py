import os
import time
from datetime import datetime
from typing import List, Dict, Optional
import logging

from langchain_community.document_loaders import PyPDFLoader, TextLoader, UnstructuredWordDocumentLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq

from config import settings
from models import Chatbot, TrainingFile, Conversation, Message
from security import SecurityManager
from sqlalchemy.orm import Session
import secrets

# Setup logging
logger = logging.getLogger(__name__)


class ChatbotManager:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(settings.VECTOR_STORE_FOLDER, exist_ok=True)

    def generate_chatbot_id(self) -> str:
        """Generate unique chatbot ID"""
        return f"bot_{secrets.token_hex(8)}"

    def generate_api_key(self) -> tuple[str, str]:
        """
        Generate unique API key

        Returns:
            Tuple of (plain_key, hashed_key) - only store hashed_key in DB
        """
        return SecurityManager.generate_api_key()

    def generate_conversation_id(self) -> str:
        """Generate unique conversation ID"""
        return f"conv_{secrets.token_hex(8)}"

    async def create_chatbot(
        self,
        db: Session,
        user_id: int,
        name: str,
        description: Optional[str],
        files: List
    ) -> Dict:
        """Create a new chatbot with uploaded files"""
        try:
            # Generate unique chatbot ID
            chatbot_id = self.generate_chatbot_id()

            # Create chatbot record
            chatbot = Chatbot(
                chatbot_id=chatbot_id,
                name=name,
                description=description,
                status="training",
                user_id=user_id
            )
            db.add(chatbot)
            db.commit()
            db.refresh(chatbot)

            # Process files
            docs = []
            total_chunks = 0

            for file in files:
                # Read file content
                content = await file.read()

                # Validate file
                is_valid, error_msg = SecurityManager.validate_file(file.filename, len(content))
                if not is_valid:
                    logger.warning(f"File validation failed for {file.filename}: {error_msg}")
                    raise ValueError(f"Invalid file {file.filename}: {error_msg}")

                # Sanitize filename
                filename = SecurityManager.sanitize_filename(file.filename)
                file_path = os.path.join(settings.UPLOAD_FOLDER, f"{chatbot_id}_{filename}")

                # Save file
                with open(file_path, "wb") as f:
                    f.write(content)

                # Track file
                training_file = TrainingFile(
                    chatbot_id=chatbot.id,
                    filename=filename,
                    file_path=file_path,
                    file_size=len(content),
                    file_type=filename.split(".")[-1].lower(),
                    status="processing"
                )
                db.add(training_file)

                # Load document
                try:
                    if filename.endswith(".pdf"):
                        loader = PyPDFLoader(file_path)
                    elif filename.endswith(".txt"):
                        loader = TextLoader(file_path)
                    elif filename.endswith(".docx"):
                        loader = UnstructuredWordDocumentLoader(file_path)
                    else:
                        continue

                    loaded_docs = loader.load()
                    for doc in loaded_docs:
                        doc.metadata["source"] = filename
                        doc.metadata["chatbot_id"] = chatbot_id
                    docs.extend(loaded_docs)

                    training_file.status = "completed"
                except Exception as e:
                    training_file.status = "failed"
                    print(f"Error loading file {filename}: {e}")

            if not docs:
                chatbot.status = "failed"
                db.commit()
                raise ValueError("No valid documents could be loaded")

            # Split into chunks
            splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,
                chunk_overlap=50
            )
            chunks = splitter.split_documents(docs)
            total_chunks = len(chunks)

            # Create vector store
            vector_store_path = os.path.join(
                settings.VECTOR_STORE_FOLDER,
                chatbot_id
            )
            vectordb = FAISS.from_documents(chunks, self.embeddings)
            vectordb.save_local(vector_store_path)

            # Update chatbot status
            chatbot.status = "active"
            chatbot.vector_store_path = vector_store_path

            # Update training files with chunk counts
            for training_file in db.query(TrainingFile).filter(
                TrainingFile.chatbot_id == chatbot.id
            ).all():
                training_file.chunks_created = total_chunks // len(files)

            db.commit()

            # Generate API key (get both plain and hashed)
            plain_key, hashed_key = self.generate_api_key()
            from models import APIKey
            api_key_obj = APIKey(
                key=hashed_key,  # Store ONLY the hash
                name="Default Key",
                chatbot_id=chatbot.id
            )
            db.add(api_key_obj)
            db.commit()

            logger.info(f"Chatbot created successfully: {chatbot_id}")

            return {
                "chatbot_id": chatbot_id,
                "name": name,
                "status": "active",
                "vector_store_path": vector_store_path,
                "documents_processed": len(docs),
                "chunks_created": total_chunks,
                "api_key": plain_key,  # Return plain key ONLY once
                "api_endpoint": f"/api/v1/{chatbot_id}/chat"
            }

        except Exception as e:
            db.rollback()
            raise e

    def load_chatbot(self, chatbot: Chatbot) -> RetrievalQA:
        """Load chatbot's RAG chain"""
        if not chatbot.vector_store_path or not os.path.exists(chatbot.vector_store_path):
            raise ValueError(f"Vector store not found for chatbot {chatbot.chatbot_id}")

        # Load vector store with dangerous deserialization disabled for security
        # Note: This uses pickle which can be exploited. In production, use a safer format.
        try:
            vectordb = FAISS.load_local(
                chatbot.vector_store_path,
                self.embeddings,
                allow_dangerous_deserialization=True  # Required for FAISS, but noted as security concern
            )
        except Exception as e:
            logger.error(f"Failed to load vector store for {chatbot.chatbot_id}: {e}")
            raise ValueError(f"Failed to load chatbot data: {str(e)}")
        retriever = vectordb.as_retriever()

        # Initialize LLM
        llm = ChatGroq(
            model_name=settings.GROQ_MODEL,
            temperature=0,
            groq_api_key=settings.GROQ_API_KEY
        )

        # Create QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            return_source_documents=True
        )

        return qa_chain

    async def chat(
        self,
        db: Session,
        chatbot: Chatbot,
        query: str,
        conversation_id: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> Dict:
        """Send a message to chatbot and get response"""
        start_time = time.time()

        # Get or create conversation
        if conversation_id:
            conversation = db.query(Conversation).filter(
                Conversation.conversation_id == conversation_id
            ).first()
        else:
            conversation_id = self.generate_conversation_id()
            conversation = Conversation(
                conversation_id=conversation_id,
                chatbot_id=chatbot.id,
                user_id=user_id
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)

        # Save user message
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=query
        )
        db.add(user_message)

        # Check for datetime queries
        if self._is_datetime_query(query):
            answer = self._get_datetime_answer(query)
            sources = ["BotFoundry System"]
            agent_actions = [{"type": "datetime", "action": "direct_response"}]
        else:
            # Load and query chatbot
            qa_chain = self.load_chatbot(chatbot)
            result = qa_chain.invoke({"query": query})

            answer = result.get("result", "")
            sources = [
                doc.metadata.get("source", "Unknown")
                for doc in result.get("source_documents", [])
            ]
            agent_actions = None

        response_time = time.time() - start_time

        # Save assistant message
        import json
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=answer,
            response_time=response_time,
            sources=json.dumps(sources),
            agent_actions=json.dumps(agent_actions) if agent_actions else None
        )
        db.add(assistant_message)

        # Update conversation stats
        conversation.message_count += 2
        conversation.avg_response_time = (
            (conversation.avg_response_time * (conversation.message_count - 2) + response_time)
            / conversation.message_count
        )

        # Update chatbot stats
        chatbot.total_messages += 2
        chatbot.total_conversations = db.query(Conversation).filter(
            Conversation.chatbot_id == chatbot.id
        ).count()
        chatbot.last_active = datetime.utcnow()
        chatbot.avg_response_time = (
            (chatbot.avg_response_time * (chatbot.total_messages - 2) + response_time)
            / chatbot.total_messages
        )

        db.commit()

        return {
            "answer": answer,
            "sources": list(set(sources)),
            "response_time": round(response_time, 2),
            "conversation_id": conversation_id,
            "agent_actions": agent_actions
        }

    def _is_datetime_query(self, query: str) -> bool:
        """Check if query is about date/time"""
        keywords = ["day", "date", "time", "today", "current time", "what time", "which day"]
        return any(kw in query.lower() for kw in keywords)

    def _get_datetime_answer(self, query: str) -> str:
        """Get direct date/time answer"""
        now = datetime.now()
        query_lower = query.lower()

        if "date" in query_lower:
            return f"Today's date is {now.strftime('%B %d, %Y')}."
        elif "time" in query_lower:
            return f"The current time is {now.strftime('%H:%M:%S')}."
        elif "day" in query_lower:
            return f"Today is {now.strftime('%A')}."
        else:
            return f"Today is {now.strftime('%A, %B %d, %Y')} and the time is {now.strftime('%H:%M:%S')}."


# Global instance
chatbot_manager = ChatbotManager()
