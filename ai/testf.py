# Previous flask version of the entire RAG architecture.
# Now replaced by FastAPI version in run.py, but keeping this file for reference and testing purposes.
from flask import Flask, request, jsonify
import os
from datetime import datetime
from werkzeug.utils import secure_filename
from flask_cors import CORS
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader, TextLoader, UnstructuredWordDocumentLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_classic.chains import RetrievalQA
from langchain_groq import ChatGroq
import re

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Properly configure CORS - allow all origins for development
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

UPLOAD_FOLDER = "uploads"
VECTOR_STORE_FOLDER = "rag_bot_store"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Verify API key is loaded
if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY not found in environment variables. Please check your .env file.")

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


def beautify_answer_html(text: str) -> str:
    # Bold text
    text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)

    # Convert bullets to <li>
    text = re.sub(r"•\s*", r"<li>", text)
    text = re.sub(r"(?<=<li>)(.*?)(?=(<li>|$))", r"\1</li>", text, flags=re.S)

    # Wrap bullet list in <ul>
    text = re.sub(r"(<li>.*?</li>)", r"<ul>\1</ul>", text, flags=re.S)

    # Add paragraph breaks
    text = text.replace("\n\n", "<br><br>")

    return text


def beautify_answer(text: str) -> str:
    """Format the answer text as HTML."""
    try:
        return beautify_answer_html(text)
    except Exception:
        return text


def is_datetime_query(query: str) -> bool:
    query_lower = query.lower()
    keywords = ["day", "date", "time", "today", "current time", "what time", "which day"]
    return any(kw in query_lower for kw in keywords)


def get_datetime_answer(query: str) -> str:
    now = datetime.now()
    if "date" in query:
        return f"Today's date is {now.strftime('%B %d, %Y')}."
    elif "time" in query:
        return f"The current time is {now.strftime('%H:%M:%S')}."
    elif "day" in query:
        return f"Today is {now.strftime('%A')}."
    else:
        return "Sorry, I can only tell you the current date, time, or day."


def runfoundry():
    # Check if vector store exists
    if not os.path.exists(VECTOR_STORE_FOLDER):
        raise FileNotFoundError(f"Vector store not found at {VECTOR_STORE_FOLDER}. Please create a chatbot first.")
    
    vectordb = FAISS.load_local(VECTOR_STORE_FOLDER, embeddings, allow_dangerous_deserialization=True)
    retriever = vectordb.as_retriever()

    # Use a currently supported Groq model
    model_name = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")

    try:
        llm = ChatGroq(model_name=model_name, temperature=0)
    except Exception as e:
        raise RuntimeError(f"Failed to create ChatGroq LLM for model '{model_name}': {e}") from e

    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=True,
    )


# Root endpoint
@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "message": "BotFoundry API",
        "version": "1.0",
        "endpoints": {
            "POST /create": "Create chatbot from files",
            "POST /ask": "Ask questions to chatbot",
            "GET /health": "Health check"
        }
    })


# Health check endpoint
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Server is running"}), 200


@app.route("/ask", methods=["POST", "OPTIONS"])
def ask():
    # Handle OPTIONS request for CORS preflight
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
            
        query = data.get("query")
        if not query:
            return jsonify({"error": "Missing 'query' in request"}), 400

        print(f"Received query: {query}")

        # Handle date/time queries
        if is_datetime_query(query):
            return jsonify({
                "answer": beautify_answer(get_datetime_answer(query)),
                "sources": ["BotFoundry Assistant"]
            })

        # Load the QA chain
        try:
            qa_chain = runfoundry()
        except FileNotFoundError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            return jsonify({"error": f"LLM initialization failed: {str(e)}"}), 500

        # Get answer from the chatbot
        try:
            result = qa_chain.invoke({"query": query})
        except Exception as e:
            return jsonify({"error": f"LLM request failed: {str(e)}"}), 500

        # Extract sources
        sources = []
        for doc in result.get("source_documents", []):
            if isinstance(doc, dict):
                sources.append(doc.get("metadata", {}).get("source", "Unknown"))
            else:
                sources.append(getattr(doc.metadata, "source", "Unknown"))

        answer = beautify_answer(result.get("result", ""))
        print(f"Returning answer: {answer[:100]}...")

        return jsonify({
            "answer": answer,
            "sources": list(set(sources))
        })
    
    except Exception as e:
        print(f"Error in /ask endpoint: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route("/create", methods=["POST", "OPTIONS"])
def create():
    # Handle OPTIONS request for CORS preflight
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        print("Received /create request")
        
        if 'files' not in request.files:
            print("No files in request")
            return jsonify({"error": "No files part in the request"}), 400

        files = request.files.getlist('files')
        if not files or len(files) == 0:
            print("Files list is empty")
            return jsonify({"error": "No files uploaded"}), 400

        print(f"Received {len(files)} files")

        docs = []
        for file in files:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            print(f"Saved file: {filename}")

            try:
                if filename.endswith(".pdf"):
                    loader = PyPDFLoader(filepath)
                elif filename.endswith(".txt"):
                    loader = TextLoader(filepath)
                elif filename.endswith(".docx"):
                    loader = UnstructuredWordDocumentLoader(filepath)
                else:
                    print(f"Unsupported file type: {filename}")
                    continue

                loaded_docs = loader.load()
                for doc in loaded_docs:
                    doc.metadata["source"] = filename
                docs.extend(loaded_docs)
                print(f"Loaded {len(loaded_docs)} documents from {filename}")
            except Exception as e:
                print(f"Error loading file {filename}: {str(e)}")
                continue

        if not docs:
            return jsonify({"error": "No valid documents could be loaded"}), 400

        print(f"Total documents loaded: {len(docs)}")

        # Split documents into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_documents(docs)
        print(f"Created {len(chunks)} chunks")

        # Create vector store
        vectordb = FAISS.from_documents(chunks, embeddings)
        vectordb.save_local(VECTOR_STORE_FOLDER)
        print(f"Vector store saved to {VECTOR_STORE_FOLDER}")

        return jsonify({
            "status": "Vector DB created successfully",
            "vector_store": VECTOR_STORE_FOLDER,
            "documents_processed": len(docs),
            "chunks_created": len(chunks)
        })
    
    except Exception as e:
        print(f"Error in /create endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500


# Run the app
if __name__ == "__main__":
    print("=" * 60)
    print("BotFoundry API Server")
    print("=" * 60)
    print(f"Server starting on http://localhost:5000")
    print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"Vector store: {os.path.abspath(VECTOR_STORE_FOLDER)}")
    print("\nAvailable endpoints:")
    print("  GET  /         - API info")
    print("  GET  /health   - Health check")
    print("  POST /create   - Create chatbot from files")
    print("  POST /ask      - Ask questions to chatbot")
    print("=" * 60)
    
    # Use use_reloader=False to prevent constant restarts
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)