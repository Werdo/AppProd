from typing import Dict, List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timedelta
import pandas as pd

from app.models.device import Device
from app.models.box import ExportBox, MasterBox
from app.models.order import Order

class ReportService:
    def __init__(self, db: Session):
        self.db = db

    async def generate_production_report(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> Dict:
        """Generate production report for date range"""
        devices = self.db.query(Device).filter(
            Device.created_at.between(start_date, end_date)
        ).all()
        
        orders = self.db.query(Order).filter(
            Order.created_at.between(start_date, end_date)
        ).all()
        
        return {
            "period": {
                "start": start_date,
                "end": end_date
            },
            "production": {
                "total_devices": len(devices),
                "completed_orders": len([o for o in orders if o.status == "completed"]),
                "in_progress_orders": len([o for o in orders if o.status == "in_progress"]),
                "daily_production": self._get_daily_production(devices)
            },
            "quality": await self.generate_quality_metrics(devices),
            "efficiency": await self.generate_efficiency_metrics(devices)
        }

    async def generate_quality_metrics(
        self,
        devices: List[Device]
    ) -> Dict:
        """Generate quality metrics"""
        total = len(devices)
        if total == 0:
            return {
                "defect_rate": 0,
                "first_pass_yield": 0,
                "rework_rate": 0
            }
            
        defects = len([d for d in devices if d.status == "defect"])
        reworks = len([d for d in devices if d.status == "rework"])
        
        return {
            "defect_rate": (defects / total) * 100,
            "first_pass
            async def generate_efficiency_metrics(
        self,
        devices: List[Device]
    ) -> Dict:
        """Generate efficiency metrics for devices"""
        if not devices:
            return {
                "average_cycle_time": 0,
                "throughput": 0,
                "utilization_rate": 0
            }

        # Calcular tiempo de ciclo promedio
        cycle_times = []
        for device in devices:
            process_records = sorted(
                device.process_records,
                key=lambda x: x.created_at
            )
            if process_records:
                start = process_records[0].created_at
                end = process_records[-1].completed_at
                if end:
                    cycle_times.append((end - start).total_seconds() / 60)

        avg_cycle_time = sum(cycle_times) / len(cycle_times) if cycle_times else 0

        # Calcular throughput (unidades por hora)
        time_range = (max(d.created_at for d in devices) -
                     min(d.created_at for d in devices))
        hours = time_range.total_seconds() / 3600
        throughput = len(devices) / hours if hours > 0 else 0

        return {
            "average_cycle_time": round(avg_cycle_time, 2),
            "throughput": round(throughput, 2),
            "utilization_rate": self._calculate_utilization_rate(devices)
        }

    def _calculate_utilization_rate(self, devices: List[Device]) -> float:
        """Calculate equipment utilization rate"""
        total_process_time = 0
        total_available_time = 0

        for device in devices:
            for record in device.process_records:
                if record.completed_at:
                    process_time = (record.completed_at - 
                                  record.created_at).total_seconds()
                    total_process_time += process_time

        # Asumiendo 8 horas por día de tiempo disponible
        date_range = (max(d.created_at for d in devices) -
                     min(d.created_at for d in devices)).days + 1
        total_available_time = date_range * 8 * 3600

        return (total_process_time / total_available_time * 100) if total_available_time > 0 else 0

    async def generate_operator_performance(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> List[Dict]:
        """Generate operator performance metrics"""
        query = """
            SELECT 
                u.id,
                u.full_name,
                COUNT(d.id) as total_devices,
                AVG(EXTRACT(EPOCH FROM (pr.completed_at - pr.created_at))) as avg_process_time,
                COUNT(CASE WHEN d.status = 'defect' THEN 1 END) as defects
            FROM users u
            JOIN process_records pr ON pr.operator_id = u.id
            JOIN devices d ON d.id = pr.device_id
            WHERE pr.created_at BETWEEN :start_date AND :end_date
            GROUP BY u.id, u.full_name
        """
        
        result = self.db.execute(
            query,
            {
                "start_date": start_date,
                "end_date": end_date
            }
        )

        return [
            {
                "operator_id": row[0],
                "name": row[1],
                "total_devices": row[2],
                "avg_process_time": round(row[3] / 60, 2) if row[3] else 0,
                "defect_rate": (row[4] / row[2] * 100) if row[2] > 0 else 0
            }
            for row in result
        ]

    async def export_report(
        self,
        data: Dict,
        format: str = "pdf"
    ) -> bytes:
        """Export report in specified format"""
        if format == "pdf":
            return await self._generate_pdf_report(data)
        elif format == "excel":
            return await self._generate_excel_report(data)
        elif format == "csv":
            return await self._generate_csv_report(data)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported format: {format}"
            )

    async def _generate_pdf_report(self, data: Dict) -> bytes:
        """Generate PDF report using reportlab"""
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []

        # Convertir datos a formato tabular
        table_data = []
        for section, metrics in data.items():
            table_data.append([section.upper()])
            if isinstance(metrics, dict):
                for key, value in metrics.items():
                    table_data.append([key, str(value)])
            table_data.append([])

        # Crear tabla
        t = Table(table_data)
        t.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        elements.append(t)
        doc.build(elements)
        
        pdf = buffer.getvalue()
        buffer.close()
        return pdf

    async def _generate_excel_report(self, data: Dict) -> bytes:
        """Generate Excel report using pandas"""
        output = BytesIO()
        
        # Crear diferentes hojas para cada sección
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            for section, metrics in data.items():
                if isinstance(metrics, dict):
                    df = pd.DataFrame(list(metrics.items()), columns=['Metric', 'Value'])
                    df.to_excel(writer, sheet_name=section, index=False)

                    # Dar formato a la hoja
                    worksheet = writer.sheets[section]
                    worksheet.set_column('A:A', 20)
                    worksheet.set_column('B:B', 15)
                    
                    # Agregar formato condicional para métricas
                    if section == 'quality':
                        workbook = writer.book
                        format_good = workbook.add_format({'bg_color': '#C6EFCE'})
                        format_bad = workbook.add_format({'bg_color': '#FFC7CE'})
                        worksheet.conditional_format('B2:B100', {
                            'type': 'cell',
                            'criteria': '>=',
                            'value': 95,
                            'format': format_good
                        })
                        worksheet.conditional_format('B2:B100', {
                            'type': 'cell',
                            'criteria': '<',
                            'value': 95,
                            'format': format_bad
                        })

        return output.getvalue()

    async def _generate_csv_report(self, data: Dict) -> bytes:
        """Generate CSV report"""
        output = BytesIO()
        writer = csv.writer(output)
        
        # Escribir encabezados
        writer.writerow(['Section', 'Metric', 'Value'])
        
        # Escribir datos
        for section, metrics in data.items():
            if isinstance(metrics, dict):
                for metric, value in metrics.items():
                    writer.writerow([section, metric, value])
            else:
                writer.writerow([section, '', metrics])
                
        return output.getvalue()