import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useWebSocket = (url) => {
  const { token } = useAuth();
  const ws = useRef(null);

  const connect = useCallback(() => {
    const wsUrl = `${url}?token=${token}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      // Reconectar después de 5 segundos
      setTimeout(connect, 5000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }, [url, token]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  const subscribe = useCallback((callback) => {
    if (ws.current) {
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        callback(data);
      };
    }
  }, []);

  return {
    sendMessage,
    subscribe,
  };
};