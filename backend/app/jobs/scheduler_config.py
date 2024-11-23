from app.jobs.job_scheduler import scheduler
from app.jobs.tasks import generate_daily_reports, database_backup, clean_old_data

def setup_scheduler():
    # Programar tareas diarias
    scheduler.add_job(
        generate_daily_reports,
        'cron',
        hour=23,
        minute=55,
        id='daily_reports'
    )

    # Backup diario
    scheduler.add_job(
        database_backup,
        'cron',
        hour=1,
        minute=0,
        id='daily_backup'
    )

    # Limpieza semanal
    scheduler.add_job(
        clean_old_data,
        'cron',
        day_of_week='sun',
        hour=2,
        minute=0,
        id='weekly_cleanup'
    )

    scheduler.start()