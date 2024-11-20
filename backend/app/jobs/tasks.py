from datetime import datetime
from app.services.report_service import ReportService
from app.services.backup_service import BackupService
from app.utils.logger import logger

async def generate_daily_reports():
    try:
        service = ReportService()
        await service.generate_end_of_day_report(datetime.now())
        logger.info("Daily reports generated successfully")
    except Exception as e:
        logger.error(f"Error generating daily reports: {str(e)}")

async def database_backup():
    try:
        service = BackupService()
        await service.create_backup()
        logger.info("Database backup completed successfully")
    except Exception as e:
        logger.error(f"Error creating database backup: {str(e)}")

async def clean_old_data():
    try:
        from app.services.maintenance_service import MaintenanceService
        service = MaintenanceService()
        await service.clean_old_records()
        logger.info("Old data cleaned successfully")
    except Exception as e:
        logger.error(f"Error cleaning old data: {str(e)}")