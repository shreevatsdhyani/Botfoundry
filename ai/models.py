from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chatbots = relationship("Chatbot", back_populates="owner", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")


class Chatbot(Base):
    __tablename__ = "chatbots"

    id = Column(Integer, primary_key=True, index=True)
    chatbot_id = Column(String(100), unique=True, index=True, nullable=False)  # bot_xxxxx
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="training")  # training, active, inactive
    vector_store_path = Column(String(500), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Statistics
    total_conversations = Column(Integer, default=0)
    total_messages = Column(Integer, default=0)
    avg_response_time = Column(Float, default=0.0)
    accuracy_score = Column(Float, default=0.0)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="chatbots")
    api_keys = relationship("APIKey", back_populates="chatbot", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="chatbot", cascade="all, delete-orphan")
    training_files = relationship("TrainingFile", back_populates="chatbot", cascade="all, delete-orphan")


class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)  # sk_xxxxx
    name = Column(String(255), nullable=True)
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    is_active = Column(Boolean, default=True)

    # Usage tracking
    total_requests = Column(Integer, default=0)
    last_used = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    # Relationships
    chatbot = relationship("Chatbot", back_populates="api_keys")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(String(100), unique=True, index=True, nullable=False)  # conv_xxxxx
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Can be anonymous

    # Metadata
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    message_count = Column(Integer, default=0)

    # Analytics
    avg_response_time = Column(Float, default=0.0)
    user_satisfaction = Column(Float, nullable=True)  # 1-5 rating

    # Relationships
    chatbot = relationship("Chatbot", back_populates="conversations")
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)

    # Metadata
    timestamp = Column(DateTime, default=datetime.utcnow)
    response_time = Column(Float, nullable=True)  # seconds
    sources = Column(Text, nullable=True)  # JSON array of source documents

    # Agent actions
    agent_actions = Column(Text, nullable=True)  # JSON array of actions taken

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")


class TrainingFile(Base):
    __tablename__ = "training_files"

    id = Column(Integer, primary_key=True, index=True)
    chatbot_id = Column(Integer, ForeignKey("chatbots.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)  # bytes
    file_type = Column(String(50), nullable=False)  # pdf, docx, txt, json

    # Processing
    chunks_created = Column(Integer, default=0)
    status = Column(String(50), default="processing")  # processing, completed, failed

    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    chatbot = relationship("Chatbot", back_populates="training_files")
