# WebSocket Integration for ProcessingScreen

This document describes the WebSocket integration implemented in the ProcessingScreen component for real-time processing updates.

## Overview

The ProcessingScreen now connects to a WebSocket server to receive real-time updates about the processing status instead of using mock progress animations.

## Architecture

### Components

1. **WebSocketService** (`src/services/websocket.ts`)
   - Handles WebSocket connection, reconnection, and message parsing
   - Provides automatic reconnection with exponential backoff
   - Manages connection state and error handling

2. **useWebSocket Hook** (`src/hooks/useWebSocket.ts`)
   - React hook for managing WebSocket connections
   - Provides connection state and message handling
   - Automatically connects/disconnects based on component lifecycle

3. **ProcessingScreen** (`src/components/screens/ProcessingScreen.tsx`)
   - Main component that displays processing progress
   - Integrates with WebSocket for real-time updates
   - Shows connection status and processing steps

### Types

```typescript
interface WebSocketMessage {
  step: string;        // 'extract' | 'prepare'
  status: string;      // 'running' | 'completed' | 'failed'
  context: {
    message: string;   // Custom message from server
  };
}
```

## Processing Steps

The system handles two main processing steps:

1. **extract** - Fetching and collecting app reviews
2. **prepare** - Processing and analyzing the data

### Status Flow

- `extract - running` → Start of review collection
- `extract - completed` → Reviews collected successfully
- `prepare - running` → Start of data processing
- `prepare - completed` → Processing complete (triggers completion)
- `"" - failed` → Any step failed (triggers error)

## Configuration

### Environment Variables

The WebSocket URL is now configured using environment variables:

```bash
# Set your WebSocket server URL
WS_URL=ws://localhost:8080/ws
```

### WebSocket Configuration

The system automatically detects the environment and uses the appropriate WebSocket URL:

```typescript
// src/config/websocket.ts
export const getWebSocketUrl = (): string => {
  // First try to get from environment variable
  if (process.env.WS_URL) {
    return process.env.WS_URL;
  }
  
  // Fallback to environment-specific defaults
  return process.env.NODE_ENV === 'development' 
    ? 'ws://localhost:8080/ws'
    : 'wss://your-production-domain.com/ws';
};
```

### Environment Setup

1. **Development**: Create a `.env.local` file in your project root:
   ```bash
   WS_URL=ws://localhost:8080/ws
   ```

2. **Production**: Set the environment variable in your deployment platform:
   ```bash
   WS_URL=wss://your-production-domain.com/ws
   ```

3. **Local Testing**: You can override for testing:
   ```bash
   WS_URL=ws://127.0.0.1:8080/ws npm run dev
   ```

## Usage

### Basic Implementation

```tsx
import { ProcessingScreen } from '@/components/screens/ProcessingScreen';

<ProcessingScreen
  selectedApp={selectedApp}
  onProcessingComplete={() => {
    // Handle completion
    navigate('/success');
  }}
  onProcessingError={(error) => {
    // Handle errors
    setError(error);
  }}
/>
```

### WebSocket Message Handling

The component automatically handles WebSocket messages and updates the UI accordingly:

- **Progress updates**: Based on completed steps
- **Step status**: Visual indicators for running/completed/failed states
- **Real-time messages**: Dynamic content from server context
- **Error handling**: Automatic error display and callback triggers

## Features

### Real-time Updates
- Live progress tracking based on server events
- Dynamic step status updates
- Custom messages from server context

### Connection Management
- Automatic reconnection on connection loss
- Connection status indicators
- Fallback progress animation when disconnected

### Error Handling
- WebSocket connection errors
- Processing step failures
- Graceful degradation when disconnected

### Visual Feedback
- Step-by-step progress visualization
- Status-based color coding (running, completed, failed)
- Loading animations and icons
- Connection status indicators

## Server Requirements

Your WebSocket server should send messages in this format:

```json
{
  "step": "extract",
  "status": "running",
  "context": {
    "message": "Collecting reviews from App Store..."
  }
}
```

### Expected Message Sequence

1. `{"step": "extract", "status": "running", "context": {"message": "Starting review collection..."}}`
2. `{"step": "extract", "status": "completed", "context": {"message": "Reviews collected successfully"}}`
3. `{"step": "prepare", "status": "running", "context": {"message": "Processing review data..."}}`
4. `{"step": "prepare", "status": "completed", "context": {"message": "Analysis complete!"}}`

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check `WS_URL` environment variable
   - Verify server is running and accessible
   - Check network/firewall settings

2. **Messages Not Received**
   - Verify message format matches expected schema
   - Check server WebSocket implementation
   - Review browser console for errors

3. **Reconnection Issues**
   - Check `reconnectAttempts` and `reconnectDelay` settings
   - Verify server handles reconnections properly

### Debug Mode

Enable console logging by checking the browser console for:
- WebSocket connection status
- Received messages
- Error details
- Reconnection attempts

### Environment Variable Debugging

To verify your environment variable is loaded:

```bash
# Check if the variable is loaded
echo $WS_URL

# In your React app, add this temporarily:
console.log('WebSocket URL:', process.env.WS_URL);
```

## Future Enhancements

- Message queuing for offline scenarios
- Custom retry strategies
- Message validation and sanitization
- Performance metrics and monitoring
- Support for additional processing steps
