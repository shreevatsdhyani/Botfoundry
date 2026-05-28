from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: str
    username: str
    full_name: Optional[str] = None

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        import re
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Invalid email format')
        return v.lower()


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128, description="Password must be 8-128 characters")


class UserLogin(BaseModel):
    email: str
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        import re
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Invalid email format')
        return v.lower()


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_premium: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None


# Chatbot Schemas
class ChatbotCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class ChatbotResponse(BaseModel):
    id: int
    chatbot_id: str
    name: str
    description: Optional[str]
    status: str
    total_conversations: int
    total_messages: int
    avg_response_time: float
    accuracy_score: float
    created_at: datetime
    last_active: datetime

    class Config:
        from_attributes = True


class ChatbotWithAPI(ChatbotResponse):
    api_endpoint: str
    api_keys: List["APIKeyResponse"]


# API Key Schemas
class APIKeyCreate(BaseModel):
    name: Optional[str] = None
    expires_in_days: Optional[int] = None


class APIKeyResponse(BaseModel):
    id: int
    key: str
    name: Optional[str]
    is_active: bool
    total_requests: int
    created_at: datetime
    expires_at: Optional[datetime]
    last_used: Optional[datetime]

    class Config:
        from_attributes = True


# Message Schemas
class MessageRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=5000)
    conversation_id: Optional[str] = None


class MessageResponse(BaseModel):
    answer: str
    sources: List[str]
    response_time: float
    conversation_id: str
    agent_actions: Optional[List[dict]] = None


# Conversation Schemas
class ConversationResponse(BaseModel):
    id: int
    conversation_id: str
    chatbot_id: int
    started_at: datetime
    message_count: int
    avg_response_time: float

    class Config:
        from_attributes = True


class ConversationDetail(ConversationResponse):
    messages: List["MessageDetail"]


class MessageDetail(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime
    response_time: Optional[float]
    sources: Optional[str]

    class Config:
        from_attributes = True


# File Upload Schemas
class FileUploadResponse(BaseModel):
    filename: str
    file_size: int
    file_type: str
    status: str


class ChatbotCreationResponse(BaseModel):
    chatbot_id: str
    name: str
    status: str
    vector_store_path: str
    documents_processed: int
    chunks_created: int
    api_key: str
    api_endpoint: str


# Analytics Schemas
class ChatbotAnalytics(BaseModel):
    chatbot_id: str
    total_conversations: int
    total_messages: int
    avg_response_time: float
    messages_per_day: List[dict]
    popular_queries: List[dict]
    accuracy_score: float


# Health Check
class HealthResponse(BaseModel):
    status: str
    message: str
    version: str = "2.0.0"
    database: str = "connected"
