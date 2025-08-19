export const WEBSOCKET_CONFIG = {
  development: {
    url: process.env.VITE_WS_URL || 'ws://localhost:8080/ws',
    reconnectAttempts: 5,
    reconnectDelay: 1000,
  },
  production: {
    url: process.env.VITE_WS_URL || 'wss://your-production-domain.com/ws',
    reconnectAttempts: 5,
    reconnectDelay: 1000,
  }
};

export const getWebSocketUrl = (): string => {
  // First try to get from environment variable
  if (process.env.VITE_WS_URL) {
    return process.env.VITE_WS_URL;
  }
  
  // Fallback to environment-specific defaults
  return process.env.NODE_ENV === 'development' 
    ? WEBSOCKET_CONFIG.development.url 
    : WEBSOCKET_CONFIG.production.url;
};
