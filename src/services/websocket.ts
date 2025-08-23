export interface WebSocketMessage {
  step: string;
  status: string;
  context: {
    message: string;
  };
}

export interface WebSocketCallbacks {
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private callbacks: WebSocketCallbacks = {};
  private shouldReconnect = true;
  private connectionTimeout: NodeJS.Timeout | null = null;

  constructor(
    private url: string,
    callbacks: WebSocketCallbacks = {}
  ) {
    this.callbacks = callbacks;
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.url);
      
      // Set a connection timeout to detect immediate failures
      this.connectionTimeout = setTimeout(() => {
        if (this.ws?.readyState === WebSocket.CONNECTING) {
          console.log('WebSocket connection timeout - likely authentication failure');
          this.shouldReconnect = false;
          this.ws?.close();
        }
      }, 5000); // 5 second timeout
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        this.reconnectAttempts = 0;
        this.shouldReconnect = true;
        this.callbacks.onOpen?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.callbacks.onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        
        this.callbacks.onClose?.();
        
        // Handle different close codes
        switch (event.code) {
          case 1000: // Normal closure
            console.log('WebSocket closed normally, not reconnecting');
            this.shouldReconnect = false;
            break;
          case 1006: // Abnormal closure (connection lost)
            console.log('WebSocket connection lost abnormally');
            // Only reconnect if we were previously connected
            if (this.reconnectAttempts === 0) {
              console.log('Connection failed immediately, likely due to authentication. Stopping reconnection.');
              this.shouldReconnect = false;
            }
            break;
          case 1011: // Server error
            console.log('WebSocket server error, not reconnecting');
            this.shouldReconnect = false;
            break;
          case 1015: // TLS handshake failure
            console.log('WebSocket TLS handshake failed, not reconnecting');
            this.shouldReconnect = false;
            break;
          default:
            console.log(`WebSocket closed with code ${event.code}, reason: ${event.reason}`);
        }
        
        // Check if we should attempt to reconnect
        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        } else {
          console.log('Max reconnection attempts reached or reconnection disabled');
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        
        // Clear connection timeout on error
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        
        // Check if this is an authentication error or immediate failure
        if (this.ws?.readyState === WebSocket.CLOSED) {
          // If the connection was immediately closed, it might be an auth issue
          this.shouldReconnect = false;
          console.log('WebSocket connection failed immediately, likely due to authentication or server rejection. Stopping reconnection attempts.');
        }
        
        this.callbacks.onError?.(error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.shouldReconnect = false;
    }
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) {
      console.log('Reconnection disabled, not scheduling reconnect');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect();
      }
    }, delay);
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    if (this.ws) {
      this.ws.close(1000, 'User initiated disconnect');
      this.ws = null;
    }
  }

  // Method to manually stop reconnection attempts
  stopReconnecting(): void {
    this.shouldReconnect = false;
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    console.log('Reconnection attempts stopped');
  }

  // Method to reset and allow reconnection again
  resetReconnection(): void {
    this.shouldReconnect = true;
    this.reconnectAttempts = 0;
    console.log('Reconnection reset, will attempt to connect again');
  }

  send(data: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
