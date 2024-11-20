from typing import Generator, Optional
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.core.config import settings
from app.core.security import verify_token
from app.models.user import User
from app.schemas.token import TokenPayload
from app.services.printer_service import PrinterService
from app.services.device_service import DeviceService
from app.services.box_service import BoxService
from app.services.report_service import ReportService

# OAuth2 scheme for token
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    scopes={
        "devices": "Operations with devices",
        "boxes": "Operations with boxes",
        "reports": "Access to reports",
        "admin": "Admin level access",
    },
)

def get_db() -> Generator:
    """
    Database session dependency.
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_current_user(
    security_scopes: SecurityScopes,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Get current authenticated user with scope validation.
    """
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        
        # Validate token expiration
        if token_data.exp < datetime.utcnow().timestamp():
            raise credentials_exception
            
    except (JWTError, ValidationError):
        raise credentials_exception

    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise credentials_exception
    
    # Validate user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    # Validate required scopes
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )

    return user

async def get_current_active_user(
    current_user: User = Security(get_current_user, scopes=[])
) -> User:
    """
    Get current active user.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

async def get_current_active_superuser(
    current_user: User = Security(get_current_user, scopes=["admin"])
) -> User:
    """
    Get current active superuser.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    return current_user

def get_device_service(db: Session = Depends(get_db)) -> DeviceService:
    """
    Device service dependency.
    """
    return DeviceService(db)

def get_box_service(db: Session = Depends(get_db)) -> BoxService:
    """
    Box service dependency.
    """
    return BoxService(db)

def get_printer_service(db: Session = Depends(get_db)) -> PrinterService:
    """
    Printer service dependency.
    """
    return PrinterService(db)

def get_report_service(db: Session = Depends(get_db)) -> ReportService:
    """
    Report service dependency.
    """
    return ReportService(db)

async def validate_printer_access(
    current_user: User = Security(get_current_user, scopes=["devices"]),
    printer_service: PrinterService = Depends(get_printer_service)
) -> PrinterService:
    """
    Validate printer access and return printer service.
    """
    if not await printer_service.check_printer_access(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No printer access"
        )
    return printer_service

async def validate_report_access(
    report_type: str,
    current_user: User = Security(get_current_user, scopes=["reports"])
) -> bool:
    """
    Validate report access based on report type and user permissions.
    """
    if report_type in ["efficiency", "quality"] and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges for this report type"
        )
    return True

class RateLimitDependency:
    """
    Rate limiting dependency for API endpoints.
    """
    def __init__(self, requests: int, window: int):
        self.requests = requests
        self.window = window
        self._cache = {}

    async def __call__(self, user: User = Depends(get_current_user)):
        now = datetime.utcnow().timestamp()
        user_key = f"rate_limit:{user.id}"
        
        # Clean old entries
        self._cache = {
            k: v for k, v in self._cache.items()
            if now - v["start"] < self.window
        }
        
        if user_key not in self._cache:
            self._cache[user_key] = {
                "count": 0,
                "start": now
            }
        
        # Check rate limit
        if self._cache[user_key]["count"] >= self.requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded"
            )
            
        self._cache[user_key]["count"] += 1
        return True

# Rate limit instances
standard_rate_limit = RateLimitDependency(requests=100, window=60)  # 100 requests per minute
printer_rate_limit = RateLimitDependency(requests=10, window=60)    # 10 print jobs per minute