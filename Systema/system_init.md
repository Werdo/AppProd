##Instalación del Sistema
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/production-system.git /opt/production_system

# 2. Ejecutar instalación
cd /opt/production_system
chmod +x scripts/setup/install.sh
sudo ./scripts/setup/install.sh

# 3. Configurar variables de entorno
cp .env.example .env
nano .env

# 4. Iniciar servicios
./scripts/services/start_services.sh

##Configuración de Cron Jobs
# Añadir al crontab
crontab -e

# Añadir las siguientes líneas
# Backup diario a las 2 AM
0 2 * * * /opt/production_system/scripts/maintenance/backup.sh

# Monitoreo cada 5 minutos
*/5 * * * * /opt/production_system/scripts/maintenance/monitor.sh

# Reinicio semanal de servicios (Domingos a las 3 AM)
0 3 * * 0 /opt/production_system/scripts/services/restart_services.sh