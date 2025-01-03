from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.services.auth_service import AuthService
from app.core.config import settings
from app.schemas.token import Token

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login.
    """
    service = AuthService(db)
    user = service.authenticate(
        username=form_data.username,
        password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=400, detail="Incorrect username or password"
        )
    
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return {
        "access_token": service.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/login/qr", response_model=Token)
def login_qr(
    *,
    db: Session = Depends(deps.get_db),
    qr_code: str,
) -> Any:
    """
    Login using QR code.
    """
    service = AuthService(db)
    user = service.authenticate_qr(qr_code)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid QR code"
        )
    
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return {
        "access_token": service.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }