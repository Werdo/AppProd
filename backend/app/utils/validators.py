from typing import Tuple, Optional
import re
from datetime import datetime

def validate_imei_iccid(imei: str, iccid: str) -> Tuple[bool, Optional[str]]:
    """Validate IMEI and ICCID formats"""
    # Validar IMEI
    if not re.match(r'^\d{15}$', imei):
        return False, "IMEI must be exactly 15 digits"

    # Validar ICCID
    if not re.match(r'^\d{19,20}$', iccid):
        return False, "ICCID must be 19 or 20 digits"

    # Validar dígito de verificación IMEI
    if not _validate_imei_checksum(imei):
        return False, "Invalid IMEI checksum"

    return True, None

def _validate_imei_checksum(imei: str) -> bool:
    """Validate IMEI checksum using Luhn algorithm"""
    digits = [int(d) for d in imei]
    checksum = digits[-1]
    digits = digits[:-1]
    
    total = 0
    for i, digit in enumerate(digits):
        if i % 2 == 0:
            doubled = digit * 2
            total += doubled if doubled < 10 else doubled - 9
        else:
            total += digit
            
    return (total + checksum) % 10 == 0

def validate_production_order(
    quantity: int,
    start_date: datetime,
    end_date: Optional[datetime]
) -> Tuple[bool, Optional[str]]:
    """Validate production order parameters"""
    if quantity <= 0:
        return False, "Quantity must be greater than 0"
        
    if start_date < datetime.now():
        return False, "Start date cannot be in the past"
        
    if end_date and end_date <= start_date:
        return False, "End date must be after start date"
        
    return True, None

def validate_box_completion(
    devices_count: int,
    box_type: str
) -> Tuple[bool, Optional[str]]:
    """Validate box completion requirements"""
    if box_type == "export" and devices_count != 24:
        return False, "Export box must contain exactly 24 devices"
        
    if box_type == "master" and devices_count != 96:
        return False, "Master box must contain exactly 96 devices"
        
    return True, None

def validate_process_sequence(
    current_process: str,
    previous_process: Optional[str],
    device_status: str
) -> Tuple[bool, Optional[str]]:
    """Validate process sequence"""
    process_order = ['assembly', 'testing', 'packaging']
    
    if device_status != 'in_progress':
        return False, "Device must be in progress status"
        
    if not previous_process and current_process != process_order[0]:
        return False, "Must start with assembly process"
        
    if previous_process:
        curr_idx = process_order.index(current_process)
        prev_idx = process_order.index(previous_process)
        if curr_idx != prev_idx + 1:
            return False, "Invalid process sequence"
            
    return True, None