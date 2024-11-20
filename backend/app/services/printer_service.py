from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
import cups
from datetime import datetime

from app.models.box import ExportBox, MasterBox
from app.schemas.printer import PrintJob

class PrinterService:
    def __init__(self, db: Session):
        self.db = db
        self.conn = cups.Connection()

    def get_printers(self) -> List[dict]:
        """Get list of available printers"""
        printers = self.conn.getPrinters()
        return [
            {
                "name": name,
                "status": printer["printer-state-message"],
                "enabled": printer["printer-is-accepting-jobs"]
            }
            for name, printer in printers.items()
        ]

    async def print_export_box_label(self, box_id: int) -> bool:
        """Print label for export box"""
        box = self.db.query(ExportBox).filter(
            ExportBox.id == box_id
        ).first()
        
        if not box:
            raise HTTPException(
                status_code=404,
                detail="Export box not found"
            )
            
        # Generar ZPL para la etiqueta
        zpl = self._generate_export_box_zpl(box)
        
        # Enviar a impresora
        try:
            self.conn.printFile(
                "ZEBRA_PRINTER",
                "/tmp/label.zpl",
                "Export Box Label",
                {"raw": zpl}
            )
            return True
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error printing label: {str(e)}"
            )

    async def print_master_box_label(self, box_id: int) -> bool:
        """Print label for master box"""
        box = self.db.query(MasterBox).filter(
            MasterBox.id == box_id
        ).first()
        
        if not box:
            raise HTTPException(
                status_code=404,
                detail="Master box not found"
            )
            
        # Generar ZPL para la etiqueta
        zpl = self._generate_master_box_zpl(box)
        
        # Enviar a impresora
        try:
            self.conn.printFile(
                "ZEBRA_PRINTER",
                "/tmp/label.zpl",
                "Master Box Label",
                {"raw": zpl}
            )
            return True
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error printing label: {str(e)}"
            )

    def _generate_export_box_zpl(self, box: ExportBox) -> str:
        """Generate ZPL code for export box label"""
        zpl = "^XA\n"  # Start
        
        # Box information
        zpl += f"^FO50,50^A0N,50,50^FDExport Box: {box.code}^FS\n"
        zpl += f"^FO50,120^A0N,30,30^FDOrder: {box.order.order_number}^FS\n"
        zpl += f"^FO50,170^A0N,30,30^FDDate: {datetime.now().strftime('%Y-%m-%d')}^FS\n"
        
        # Devices list
        y = 250
        for device in box.devices:
            zpl += f"^FO50,{y}^BCN,50,Y,N,N^FD{device.imei}^FS\n"
            y += 80
            
        zpl += "^XZ"  # End
        return zpl

    def _generate_master_box_zpl(self, box: MasterBox) -> str:
        """Generate ZPL code for master box label"""
        # Similar to export box but with master box specific information
        pass