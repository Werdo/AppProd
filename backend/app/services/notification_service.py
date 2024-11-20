from app.websockets.connection_manager import manager

class NotificationService:
    @staticmethod
    async def notify_production_update(order_id: int, data: dict):
        await manager.broadcast_to_all({
            "type": "production_update",
            "order_id": order_id,
            "data": data
        })

    @staticmethod
    async def notify_box_completion(box_id: int, box_type: str, data: dict):
        await manager.broadcast_to_all({
            "type": "box_completed",
            "box_id": box_id,
            "box_type": box_type,
            "data": data
        })

    @staticmethod
    async def notify_printer_status(printer_id: str, status: str):
        await manager.broadcast_to_all({
            "type": "printer_status",
            "printer_id": printer_id,
            "status": status
        })