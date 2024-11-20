import logging
from logging.handlers import RotatingFileHandler
from app.core.config import settings

def setup_logging():
    logger = logging.getLogger("production_system")
    logger.setLevel(settings.LOG_LEVEL)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(
        logging.Formatter(settings.LOG_FORMAT)
    )
    logger.addHandler(console_handler)

    # File handler
    file_handler = RotatingFileHandler(
        "logs/production_system.log",
        maxBytes=10485760,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(
        logging.Formatter(settings.LOG_FORMAT)
    )
    logger.addHandler(file_handler)

    return logger

logger = setup_logging()