import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketService, WebSocketMessage } from '@/services/websocket';

export interface UseWebSocketOptions {
  url: string;
  autoConnect?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const { url, autoConnect = true, onMessage, onOpen, onClose, onError } = options;
  
  const wsRef = useRef<WebSocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    setLastMessage(message);
    setConnectionError(null); // Clear any previous errors on successful message
    onMessage?.(message);
  }, [onMessage]);

  const handleOpen = useCallback(() => {
    setIsConnected(true);
    setConnectionError(null); // Clear any previous errors on successful connection
    onOpen?.();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    setIsConnected(false);
    onClose?.();
  }, [onClose]);

  const handleError = useCallback((error: Event) => {
    setConnectionError('WebSocket connection failed');
    onError?.(error);
  }, [onError]);

  const connect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }

    wsRef.current = new WebSocketService(url, {
      onMessage: handleMessage,
      onOpen: handleOpen,
      onClose: handleClose,
      onError: handleError,
    });

    wsRef.current.connect();
  }, [url, handleMessage, handleOpen, handleClose, handleError]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionError(null);
  }, []);

  const stopReconnecting = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.stopReconnecting();
    }
  }, []);

  const resetReconnection = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.resetReconnection();
    }
  }, []);

  const send = useCallback((data: unknown) => {
    if (wsRef.current) {
      wsRef.current.send(data);
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    connectionError,
    connect,
    disconnect,
    stopReconnecting,
    resetReconnection,
    send,
  };
};
