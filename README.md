# Quiby Frontend

A React-based frontend application for analyzing app reviews with AI-powered insights.

## Features

- Modern React 18 with TypeScript
- Real-time WebSocket integration for processing updates
- Responsive UI with Tailwind CSS
- Telegram Web App integration
- Progressive Web App capabilities

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Configuration

The application uses environment variables for configuration. Create a `.env.local` file in your project root:

```bash
# WebSocket Configuration
WS_URL=ws://localhost:8080/ws

# Other environment variables
NODE_ENV=development
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## WebSocket Integration

The application includes real-time WebSocket integration for processing updates. See [WEBSOCKET_INTEGRATION.md](./WEBSOCKET_INTEGRATION.md) for detailed configuration and usage instructions.

### Quick Setup

1. Set your WebSocket server URL:
   ```bash
   WS_URL=ws://your-server.com/ws
   ```

2. The ProcessingScreen will automatically connect and display real-time updates

## Project Structure

```
src/
├── components/          # React components
│   ├── screens/        # Screen components
│   ├── ui/            # UI components
│   └── layout/        # Layout components
├── hooks/              # Custom React hooks
├── services/           # API and WebSocket services
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
