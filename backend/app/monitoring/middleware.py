from fastapi import Request
import time
from app.monitoring.metrics import http_requests_total, request_duration_seconds

async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    http_requests_total.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()

    request_duration_seconds.labels(
        endpoint=request.url.path
    ).observe(duration)

    return response