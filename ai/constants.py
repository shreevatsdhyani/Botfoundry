"""
Application constants for BotFoundry
Centralized configuration values
"""

# API versioning
API_VERSION = "v1"
API_PREFIX = f"/api/{API_VERSION}"

# File processing
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
MAX_FILE_SIZE_MB = 10
ALLOWED_FILE_EXTENSIONS = {".pdf", ".txt", ".docx", ".doc"}

# Embeddings
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# LLM
DEFAULT_LLM_MODEL = "llama-3.1-8b-instant"
DEFAULT_LLM_TEMPERATURE = 0

# Authentication
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 128
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Database
DB_POOL_SIZE = 10
DB_MAX_OVERFLOW = 20

# Rate Limiting
RATE_LIMIT_PER_MINUTE = 60
RATE_LIMIT_PER_HOUR = 1000
LOGIN_ATTEMPTS_MAX = 5
LOGIN_LOCKOUT_MINUTES = 15

# Status codes
STATUS_TRAINING = "training"
STATUS_ACTIVE = "active"
STATUS_INACTIVE = "inactive"
STATUS_FAILED = "failed"

# Message roles
ROLE_USER = "user"
ROLE_ASSISTANT = "assistant"

# Agent tools
AGENT_TOOL_WEB_SEARCH = "web_search"
AGENT_TOOL_CALCULATOR = "calculator"
AGENT_TOOL_DATETIME = "datetime"

# Error messages
ERROR_CHATBOT_NOT_FOUND = "Chatbot not found"
ERROR_UNAUTHORIZED = "Unauthorized access"
ERROR_INVALID_CREDENTIALS = "Invalid email or password"
ERROR_FILE_TOO_LARGE = "File size exceeds maximum allowed"
ERROR_INVALID_FILE_TYPE = "Invalid file type"
ERROR_RATE_LIMIT_EXCEEDED = "Too many requests. Please try again later."
ERROR_SERVER_ERROR = "Internal server error"
