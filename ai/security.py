"""
Security utilities for BotFoundry
Handles API key hashing, file validation, rate limiting
"""

import hashlib
import secrets
import mimetypes
from pathlib import Path
from typing import Optional
from datetime import datetime, timedelta


class SecurityManager:
    """Centralized security management"""

    # Allowed file extensions
    ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx", ".doc"}

    # Allowed MIME types
    ALLOWED_MIME_TYPES = {
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    }

    # Max file size (10MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024

    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """
        Hash API key using SHA-256

        Args:
            api_key: Plain text API key

        Returns:
            Hashed API key
        """
        return hashlib.sha256(api_key.encode()).hexdigest()

    @staticmethod
    def generate_api_key() -> tuple[str, str]:
        """
        Generate a new API key and its hash

        Returns:
            Tuple of (plain_key, hashed_key)
        """
        plain_key = f"sk_{secrets.token_urlsafe(32)}"
        hashed_key = SecurityManager.hash_api_key(plain_key)
        return plain_key, hashed_key

    @staticmethod
    def verify_api_key(plain_key: str, hashed_key: str) -> bool:
        """
        Verify API key against stored hash

        Args:
            plain_key: Plain text API key
            hashed_key: Stored hash

        Returns:
            True if match, False otherwise
        """
        return SecurityManager.hash_api_key(plain_key) == hashed_key

    @staticmethod
    def validate_file(filename: str, file_size: int) -> tuple[bool, Optional[str]]:
        """
        Validate uploaded file

        Args:
            filename: Name of file
            file_size: Size in bytes

        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check file extension
        file_ext = Path(filename).suffix.lower()
        if file_ext not in SecurityManager.ALLOWED_EXTENSIONS:
            return False, f"File type {file_ext} not allowed. Allowed: {', '.join(SecurityManager.ALLOWED_EXTENSIONS)}"

        # Check file size
        if file_size > SecurityManager.MAX_FILE_SIZE:
            max_mb = SecurityManager.MAX_FILE_SIZE / (1024 * 1024)
            return False, f"File size {file_size/(1024*1024):.1f}MB exceeds maximum {max_mb}MB"

        # Check MIME type
        mime_type, _ = mimetypes.guess_type(filename)
        if mime_type and mime_type not in SecurityManager.ALLOWED_MIME_TYPES:
            return False, f"MIME type {mime_type} not allowed"

        return True, None

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """
        Sanitize filename to prevent directory traversal

        Args:
            filename: Original filename

        Returns:
            Sanitized filename
        """
        # Remove any path components
        filename = Path(filename).name

        # Remove dangerous characters
        dangerous_chars = ['..', '/', '\\', '\x00', '\n', '\r']
        for char in dangerous_chars:
            filename = filename.replace(char, '_')

        # Limit length
        if len(filename) > 255:
            name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
            filename = name[:255-len(ext)-1] + '.' + ext if ext else name[:255]

        return filename


# Rate limiting configuration
class RateLimitConfig:
    """Rate limiting settings"""

    # Per IP limits
    REQUESTS_PER_MINUTE_IP = 60
    REQUESTS_PER_HOUR_IP = 1000

    # Per user limits
    REQUESTS_PER_MINUTE_USER = 100
    REQUESTS_PER_HOUR_USER = 5000

    # Per API key limits
    REQUESTS_PER_MINUTE_API_KEY = 60
    REQUESTS_PER_HOUR_API_KEY = 10000

    # Login attempt limits
    LOGIN_ATTEMPTS_PER_IP = 5
    LOGIN_LOCKOUT_MINUTES = 15


# Login attempt tracker (in-memory for dev, use Redis for prod)
class LoginAttemptTracker:
    """Track failed login attempts"""

    def __init__(self):
        self.attempts = {}  # {ip: [(timestamp, count)]}

    def record_attempt(self, ip: str, success: bool):
        """Record a login attempt"""
        now = datetime.utcnow()

        if ip not in self.attempts:
            self.attempts[ip] = []

        # Clean old attempts
        cutoff = now - timedelta(minutes=RateLimitConfig.LOGIN_LOCKOUT_MINUTES)
        self.attempts[ip] = [
            (ts, count) for ts, count in self.attempts[ip]
            if ts > cutoff
        ]

        if success:
            # Clear attempts on success
            self.attempts[ip] = []
        else:
            # Add failed attempt
            self.attempts[ip].append((now, 1))

    def is_locked_out(self, ip: str) -> tuple[bool, Optional[int]]:
        """
        Check if IP is locked out

        Returns:
            Tuple of (is_locked, seconds_remaining)
        """
        if ip not in self.attempts:
            return False, None

        now = datetime.utcnow()
        cutoff = now - timedelta(minutes=RateLimitConfig.LOGIN_LOCKOUT_MINUTES)

        # Count recent failed attempts
        recent_attempts = [
            (ts, count) for ts, count in self.attempts[ip]
            if ts > cutoff
        ]

        if len(recent_attempts) >= RateLimitConfig.LOGIN_ATTEMPTS_PER_IP:
            # Calculate remaining lockout time
            oldest_attempt = min(ts for ts, _ in recent_attempts)
            unlock_time = oldest_attempt + timedelta(minutes=RateLimitConfig.LOGIN_LOCKOUT_MINUTES)
            seconds_remaining = int((unlock_time - now).total_seconds())
            return True, seconds_remaining

        return False, None


# Global instance
login_tracker = LoginAttemptTracker()
