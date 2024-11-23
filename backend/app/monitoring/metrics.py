from prometheus_client import Counter, Histogram, Gauge
from app.utils.logger import logger

# Contadores
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

device_registrations = Counter(
    'device_registrations_total',
    'Total device registrations'
)

print_jobs_total = Counter(
    'print_jobs_total',
    'Total print jobs',
    ['printer', 'status']
)

# Histogramas
request_duration_seconds = Histogram(
    'request_duration_seconds',
    'HTTP request duration in seconds',
    ['endpoint']
)

process_duration_seconds = Histogram(
    'process_duration_seconds',
    'Process duration in seconds',
    ['process_name']
)

# Medidores
active_websocket_connections = Gauge(
    'active_websocket_connections',
    'Number of active websocket connections'
)

printer_queue_size = Gauge(
    'printer_queue_size',
    'Current size of printer queue',
    ['printer']
)