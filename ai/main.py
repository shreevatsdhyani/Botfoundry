from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File as FastAPIFile, Form, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from database import engine, Base, get_db
from config import settings
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    create_refresh_token,
    get_current_user,
    verify_api_key
)
from models import User, Chatbot, APIKey, Conversation, Message
from schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
    ChatbotCreate,
    ChatbotResponse,
    ChatbotWithAPI,
    MessageRequest,
    MessageResponse,
    APIKeyCreate,
    APIKeyResponse,
    ChatbotCreationResponse,
    ConversationResponse,
    HealthResponse
)
from chatbot_manager import chatbot_manager
from agent_tools import agent_tools
from security import login_tracker, RateLimitConfig
from errors import setup_error_handlers
from constants import *

# Configure logging - minimal console output
logging.basicConfig(
    level=logging.WARNING,  # Only show warnings and errors in console
    format='%(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI app
app = FastAPI(
    title="BotFoundry API",
    description="AI Chatbot Builder with RAG and Agent Capabilities",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Setup custom error handlers
setup_error_handlers(app)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Log startup info once"""
    print("\n" + "=" * 60)
    print("🚀 BotFoundry API v2.0")
    print(f"📍 Server: http://localhost:5000")
    print(f"📚 Docs: http://localhost:5000/docs")
    print(f"🌐 CORS: {len(settings.ALLOWED_ORIGINS)} origins configured")
    print("=" * 60 + "\n")


# ==================== Health & Root ====================

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with API information"""
    return {
        "status": "ok",
        "message": "BotFoundry API v2.0",
        "version": "2.0.0",
        "database": "connected"
    }


@app.get("/health", response_model=HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    try:
        # Test database connection
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "message": "All systems operational",
            "version": "2.0.0",
            "database": "connected"
        }
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "message": f"Database error: {str(e)}",
                "version": "2.0.0",
                "database": "disconnected"
            }
        )


# ==================== Authentication ====================

@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()

    if existing_user:
        if existing_user.email == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

    # Create user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    logger.info(f"New user registered: {user.email}")
    return db_user


@app.post("/auth/login", response_model=Token)
@limiter.limit(f"{RateLimitConfig.REQUESTS_PER_MINUTE_IP}/minute")
async def login(request: Request, user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user and return JWT tokens with brute force protection"""
    client_ip = request.client.host

    # Check if IP is locked out
    is_locked, seconds_remaining = login_tracker.is_locked_out(client_ip)
    if is_locked:
        logger.warning(f"Login attempt from locked out IP: {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed login attempts. Try again in {seconds_remaining} seconds."
        )

    # Authenticate user
    user = authenticate_user(db, user_credentials.email, user_credentials.password)

    if not user:
        # Record failed attempt
        login_tracker.record_attempt(client_ip, success=False)
        logger.warning(f"Failed login attempt for {user_credentials.email} from {client_ip}")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Record successful login
    login_tracker.record_attempt(client_ip, success=True)

    # Create tokens (sub must be string per JWT spec)
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token(data={"sub": str(user.id), "email": user.email})

    logger.info(f"User logged in: {user.email}")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user


# ==================== Chatbot Management ====================

@app.post("/chatbots/create", response_model=ChatbotCreationResponse)
@limiter.limit(f"{RateLimitConfig.REQUESTS_PER_MINUTE_USER}/minute")
async def create_chatbot(
    request: Request,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    files: List[UploadFile] = FastAPIFile(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new chatbot with training files (rate limited)"""
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one file is required"
        )

    try:
        result = await chatbot_manager.create_chatbot(
            db=db,
            user_id=current_user.id,
            name=name,
            description=description,
            files=files
        )
        logger.info(f"Chatbot created: {result['chatbot_id']} by user {current_user.email}")
        return result
    except Exception as e:
        logger.error(f"Error creating chatbot: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create chatbot: {str(e)}"
        )


@app.get("/chatbots", response_model=List[ChatbotResponse])
async def get_my_chatbots(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all chatbots for current user"""
    chatbots = db.query(Chatbot).filter(Chatbot.user_id == current_user.id).all()
    return chatbots


@app.get("/chatbots/{chatbot_id}", response_model=ChatbotWithAPI)
async def get_chatbot(
    chatbot_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific chatbot details"""
    chatbot = db.query(Chatbot).filter(
        Chatbot.chatbot_id == chatbot_id,
        Chatbot.user_id == current_user.id
    ).first()

    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )

    # Get API keys
    api_keys = db.query(APIKey).filter(APIKey.chatbot_id == chatbot.id).all()

    return {
        **chatbot.__dict__,
        "api_endpoint": f"/api/v1/{chatbot_id}/chat",
        "api_keys": api_keys
    }


@app.delete("/chatbots/{chatbot_id}")
async def delete_chatbot(
    chatbot_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a chatbot"""
    chatbot = db.query(Chatbot).filter(
        Chatbot.chatbot_id == chatbot_id,
        Chatbot.user_id == current_user.id
    ).first()

    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )

    db.delete(chatbot)
    db.commit()

    logger.info(f"Chatbot deleted: {chatbot_id} by user {current_user.email}")
    return {"message": "Chatbot deleted successfully"}


@app.patch("/chatbots/{chatbot_id}/status")
async def update_chatbot_status(
    chatbot_id: str,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update chatbot status (active/inactive)"""
    chatbot = db.query(Chatbot).filter(
        Chatbot.chatbot_id == chatbot_id,
        Chatbot.user_id == current_user.id
    ).first()

    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )

    if status not in ["active", "inactive"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'active' or 'inactive'"
        )

    chatbot.status = status
    db.commit()

    return {"message": f"Chatbot status updated to {status}"}


# ==================== Chat (Authenticated) ====================

@app.post("/chatbots/{chatbot_id}/chat", response_model=MessageResponse)
@limiter.limit(f"{RateLimitConfig.REQUESTS_PER_MINUTE_USER}/minute")
async def chat_with_chatbot(
    request: Request,
    chatbot_id: str,
    message: MessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message to your chatbot (rate limited)"""
    chatbot = db.query(Chatbot).filter(
        Chatbot.chatbot_id == chatbot_id,
        Chatbot.user_id == current_user.id
    ).first()

    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )

    if chatbot.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Chatbot is {chatbot.status}"
        )

    # Check if agent tools should be used
    tool_name = agent_tools.detect_intent(message.query)

    if tool_name:
        # Use agent tool
        tool_result = agent_tools.execute_tool(tool_name, message.query)

        if tool_result.get("success"):
            return {
                "answer": tool_result.get("message", tool_result.get("summary", "")),
                "sources": [f"Agent Tool: {tool_name}"],
                "response_time": 0.1,
                "conversation_id": message.conversation_id or chatbot_manager.generate_conversation_id(),
                "agent_actions": [tool_result]
            }

    # Use RAG chatbot
    try:
        result = await chatbot_manager.chat(
            db=db,
            chatbot=chatbot,
            query=message.query,
            conversation_id=message.conversation_id,
            user_id=current_user.id
        )
        return result
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )


# ==================== Public API (API Key Auth) ====================

@app.post("/api/v1/{chatbot_id}/chat", response_model=MessageResponse)
@limiter.limit(f"{RateLimitConfig.REQUESTS_PER_MINUTE_API_KEY}/minute")
async def public_chat(
    request: Request,
    chatbot_id: str,
    message: MessageRequest,
    x_api_key: str = Header(..., alias="X-API-Key"),
    db: Session = Depends(get_db)
):
    """Public API endpoint for chatbot (requires API key in X-API-Key header, rate limited)"""
    # Verify API key
    api_key_obj = verify_api_key(x_api_key, db)

    # Get chatbot
    chatbot = db.query(Chatbot).filter(
        Chatbot.chatbot_id == chatbot_id,
        Chatbot.id == api_key_obj.chatbot_id
    ).first()

    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )

    if chatbot.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Chatbot is {chatbot.status}"
        )

    # Check for agent tools
    tool_name = agent_tools.detect_intent(message.query)

    if tool_name:
        tool_result = agent_tools.execute_tool(tool_name, message.query)
        if tool_result.get("success"):
            return {
                "answer": tool_result.get("message", tool_result.get("summary", "")),
                "sources": [f"Agent Tool: {tool_name}"],
                "response_time": 0.1,
                "conversation_id": message.conversation_id or chatbot_manager.generate_conversation_id(),
                "agent_actions": [tool_result]
            }

    # Use RAG
    try:
        result = await chatbot_manager.chat(
            db=db,
            chatbot=chatbot,
            query=message.query,
            conversation_id=message.conversation_id,
            user_id=None  # Anonymous user
        )
        return result
    except Exception as e:
        logger.error(f"Public chat error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )


# ==================== API Key Management ====================

@app.post("/chatbots/{chatbot_id}/api-keys", response_model=APIKeyResponse)
async def create_api_key(
    chatbot_id: str,
    key_data: APIKeyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a new API key for chatbot"""
    chatbot = db.query(Chatbot).filter(
        Chatbot.chatbot_id == chatbot_id,
        Chatbot.user_id == current_user.id
    ).first()

    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )

    # Generate new key (returns plain and hashed)
    plain_key, hashed_key = chatbot_manager.generate_api_key()

    api_key = APIKey(
        key=hashed_key,  # Store ONLY the hash
        name=key_data.name or "API Key",
        chatbot_id=chatbot.id
    )

    if key_data.expires_in_days:
        from datetime import timedelta
        api_key.expires_at = datetime.utcnow() + timedelta(days=key_data.expires_in_days)

    db.add(api_key)
    db.commit()
    db.refresh(api_key)

    logger.info(f"API key created for chatbot: {chatbot_id}")

    # Return the plain key ONCE (user must save it)
    response = api_key.__dict__.copy()
    response['key'] = plain_key  # Show plain key only on creation
    return response


@app.get("/chatbots/{chatbot_id}/api-keys", response_model=List[APIKeyResponse])
async def get_api_keys(
    chatbot_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all API keys for a chatbot"""
    chatbot = db.query(Chatbot).filter(
        Chatbot.chatbot_id == chatbot_id,
        Chatbot.user_id == current_user.id
    ).first()

    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )

    api_keys = db.query(APIKey).filter(APIKey.chatbot_id == chatbot.id).all()
    return api_keys


@app.delete("/chatbots/{chatbot_id}/api-keys/{key_id}")
async def delete_api_key(
    chatbot_id: str,
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an API key"""
    chatbot = db.query(Chatbot).filter(
        Chatbot.chatbot_id == chatbot_id,
        Chatbot.user_id == current_user.id
    ).first()

    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )

    api_key = db.query(APIKey).filter(
        APIKey.id == key_id,
        APIKey.chatbot_id == chatbot.id
    ).first()

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )

    db.delete(api_key)
    db.commit()

    return {"message": "API key deleted successfully"}


# ==================== Conversations ====================

@app.get("/chatbots/{chatbot_id}/conversations", response_model=List[ConversationResponse])
async def get_conversations(
    chatbot_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for a chatbot"""
    chatbot = db.query(Chatbot).filter(
        Chatbot.chatbot_id == chatbot_id,
        Chatbot.user_id == current_user.id
    ).first()

    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found"
        )

    conversations = db.query(Conversation).filter(
        Conversation.chatbot_id == chatbot.id
    ).order_by(Conversation.started_at.desc()).all()

    return conversations


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )
