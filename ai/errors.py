"""
Custom error handlers and exceptions for BotFoundry
"""

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger(__name__)


class BotFoundryException(Exception):
    """Base exception for BotFoundry"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ChatbotNotFoundException(BotFoundryException):
    """Raised when chatbot is not found"""
    def __init__(self, chatbot_id: str):
        super().__init__(
            message=f"Chatbot {chatbot_id} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )


class InvalidFileException(BotFoundryException):
    """Raised when uploaded file is invalid"""
    def __init__(self, reason: str):
        super().__init__(
            message=f"Invalid file: {reason}",
            status_code=status.HTTP_400_BAD_REQUEST
        )


class RateLimitException(BotFoundryException):
    """Raised when rate limit is exceeded"""
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS
        )


async def botfoundry_exception_handler(request: Request, exc: BotFoundryException):
    """Handle custom BotFoundry exceptions"""
    logger.error(f"BotFoundry error: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "type": exc.__class__.__name__,
            "path": str(request.url.path)
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors"""
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation error",
            "details": exc.errors(),
            "path": str(request.url.path)
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors"""
    logger.exception(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again later.",
            "path": str(request.url.path)
        }
    )


def setup_error_handlers(app):
    """Register all error handlers"""
    app.add_exception_handler(BotFoundryException, botfoundry_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
