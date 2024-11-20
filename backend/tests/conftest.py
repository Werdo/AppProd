import pytest
from typing import Generator, Dict
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.base import Base
from app.api.deps import get_db
from app.core.config import settings
from app.models.user import User
from app.core.security import get_password_hash

# Test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db() -> Generator:
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="session")
def client() -> Generator:
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(scope="session")
def superuser_token_headers(client: TestClient) -> Dict[str, str]:
    user_data = {
        "email": "admin@test.com",
        "password": "admin123",
        "full_name": "Test Admin"
    }
    db = TestingSessionLocal()
    user = User(
        email=user_data["email"],
        hashed_password=get_password_hash(user_data["password"]),
        full_name=user_data["full_name"],
        is_superuser=True,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.close()

    response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data={
            "username": user_data["email"],
            "password": user_data["password"]
        }
    )
    auth_token = response.json()["access_token"]
    return {"Authorization": f"Bearer {auth_token}"}
```

### tests/test_api/test_auth.py
```python
from fastapi.testclient import TestClient

def test_login(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "admin@test.com",
            "password": "admin123"
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_invalid_login(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "wrong@test.com",
            "password": "wrongpass"
        }
    )
    assert response.status_code == 401