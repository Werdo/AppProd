from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.websockets.connection_manager import manager
from app.api import deps
from app.core.security import decode_token

router = APIRouter()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    token: str
):
    try:
        # Validate token
        user = decode_token(token)
        if not user:
            await websocket.close(code=4001)
            return

        await manager.connect(websocket, client_id)
        try:
            while True:
                data = await websocket.receive_json()
                # Process incoming messages if needed
                await manager.broadcast_to_client(
                    client_id,
                    {"type": "acknowledgment", "data": data}
                )
        except WebSocketDisconnect:
            manager.disconnect(websocket, client_id)
    except Exception as e:
        await websocket.close(code=4000)