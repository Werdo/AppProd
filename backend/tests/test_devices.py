import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_device_registration():
    response = client.post(
        "/api/v1/devices/",
        json={
            "imei": "123456789012345",
            "iccid": "12345678901234567890"
        }
    )
    assert response.status_code == 200
    assert "id" in response.json()
