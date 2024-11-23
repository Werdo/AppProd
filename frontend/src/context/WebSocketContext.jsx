import React from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = React.createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = React.useState(null);
  const [connected, setConnected] = React.useState(false);
  const reconnectTimeoutRef = React.useRef(null);

  const connect = React.useCallback(() => {
    if (token) {
      const ws = new WebSocket(`ws://localhost:8000/ws?token=${token}`);

      ws.onopen = () => {
        setConnected(true);
        console.log('WebSocket Connected');
      };

      ws.onclose = () => {
        setConnected(false);
        console.log('WebSocket Disconnected');
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      setSocket(ws);
    }
  }, [token]);

  React.useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const value = React.useMemo(() => ({
    socket,
    connected,
    connect
  }), [socket, connected, connect]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = React.useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};