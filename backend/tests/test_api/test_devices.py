import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_create_device(client: TestClient, superuser_token_headers):
    response = client.post(
        "/api/v1/devices/",
        headers=superuser_token_headers,
        json={
            "imei": "123456789012345",
            "iccid": "89340140323124970261",
            "order_id": 1
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "imei" in data
    assert data["status"] == "registered"

def test_get_device(client: TestClient, superuser_token_headers):
    response = client.get(
        "/api/v1/devices/123456789012345",
        headers=superuser_token_headers
    )
    assert response.status_code == 200