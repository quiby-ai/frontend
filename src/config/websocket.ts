export const WEBSOCKET_CONFIG = {
  reconnectAttempts: 5,
  reconnectDelay: 1000,
};

export const getWebSocketUrl = (): string => {
    return import.meta.env.VITE_WS_URL;
};
