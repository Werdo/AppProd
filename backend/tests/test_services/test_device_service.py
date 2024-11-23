import pytest
from app.services.device_service import DeviceService

def test_create_device(db):
    service = DeviceService(db)
    device = service.create_device({
        "imei": "123456789012345",
        "iccid": "89340140323124970261",
        "order_id": 1
    })
    assert device.imei == "123456789012345"
    assert device.status == "registered"

def test_validate_imei(db):
    service = DeviceService(db)
    with pytest.raises(ValueError):
        service.create_device({
            "imei": "invalid",
            "iccid": "89340140323124970261",
            "order_id": 1
        })