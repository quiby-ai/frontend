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
  const urlRef = useRef(url);

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
    // Only create new connection if URL changed or no existing connection
    if (wsRef.current && urlRef.current === url) {
      console.log('WebSocket already exists for this URL, not recreating');
      return;
    }

    // Disconnect existing connection if URL changed
    if (wsRef.current) {
      console.log('URL changed, disconnecting existing WebSocket');
      wsRef.current.disconnect();
    }

    console.log('Creating new WebSocket connection for:', url);
    wsRef.current = new WebSocketService(url, {
      onMessage: handleMessage,
      onOpen: handleOpen,
      onClose: handleClose,
      onError: handleError,
    });

    urlRef.current = url;
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

  const send = useCallback((data: unknown) => {
    if (wsRef.current) {
      wsRef.current.send(data);
    }
  }, []);

  // Only reconnect when URL changes
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      // Only disconnect on unmount, not on every render
      if (wsRef.current) {
        wsRef.current.disconnect();
        wsRef.current = null;
      }
    };
  }, [url]); // Only depend on URL, not on connect function

  return {
    isConnected,
    lastMessage,
    connectionError,
    connect,
    disconnect,
    send,
  };
};
