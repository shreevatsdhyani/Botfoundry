"""
Production-ready startup script for BotFoundry API
"""
import uvicorn
import os

if __name__ == "__main__":
    # Suppress excessive logging
    log_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(levelprefix)s %(message)s",
            },
            "access": {
                "format": '%(levelprefix)s %(client_addr)s - "%(request_line)s" %(status_code)s',
            },
        },
        "handlers": {
            "default": {
                "formatter": "default",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stderr",
            },
            "access": {
                "formatter": "access",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
            },
        },
        "loggers": {
            "uvicorn": {"handlers": ["default"], "level": "INFO"},
            "uvicorn.error": {"level": "INFO"},
            "uvicorn.access": {"handlers": ["access"], "level": "INFO", "propagate": False},
            "watchfiles": {"level": "WARNING"},  # Suppress watchfiles spam
        },
    }

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        reload_excludes=["*.log", "*.db", "uploads/*", "rag_bot_store/*", "__pycache__/*"],
        log_config=log_config,
    )
