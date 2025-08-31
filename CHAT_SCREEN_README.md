# Chat Screen - RAG Query Interface

## Overview

The Chat Screen provides a conversational AI interface for querying processed review data using Retrieval-Augmented Generation (RAG). Users can ask natural language questions about the analyzed reviews and receive AI-generated responses along with relevant retrieved reviews.

## Features

### 🗣️ Conversational UI
- Clean, modern chat interface with message bubbles
- User messages (right-aligned, blue background)
- Assistant messages (left-aligned, with retrieved reviews)
- Real-time typing indicators and loading states

### 🔍 RAG Query Processing
- Natural language query input
- Semantic + hybrid search over processed reviews
- AI-generated responses based on retrieved content
- Fallback to mock data in development mode

### 📊 Review Display
- Retrieved reviews shown as cards below AI responses
- Star ratings with visual indicators
- Country and date metadata
- Helpful count badges
- Clean, organized layout

### 🧭 Navigation
- Seamless navigation from Success Screen
- Back button to return to results
- Maintains app context and analysis data

## Technical Implementation

### Components
- **ChatScreen**: Main chat interface component
- **Message Display**: User and assistant message rendering
- **Review Cards**: Retrieved review information display
- **Input Area**: Query input with send button

### State Management
- Message history with timestamps
- Loading states for API calls
- Error handling and fallbacks
- Auto-scroll to latest messages

### API Integration
- **sendRAGQuery()**: Sends queries to RAG service
- **getRAGHistory()**: Retrieves chat history
- Mock data fallback for development
- Proper error handling and user feedback

### Types
```typescript
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  retrievedReviews?: RetrievedReview[];
}

interface RetrievedReview {
  id: string;
  content: string;
  rating: number;
  country: string;
  date: string;
  helpfulCount?: number;
}

interface RAGQuery {
  query: string;
  sagaId: string;
  appId: string;
  countries?: string[];
}
```

## User Flow

1. **Success Screen**: User completes review analysis
2. **Chat Button**: Clicks "Chat with AI Assistant" button
3. **Chat Interface**: Enters conversational AI environment
4. **Query Input**: Types natural language questions
5. **AI Response**: Receives AI-generated answers with relevant reviews
6. **Review Exploration**: Can examine retrieved review details
7. **Continue Chat**: Ask follow-up questions or explore different topics

## Example Queries

Users can ask questions like:
- "What are the main complaints about the app?"
- "How do users rate the customer support?"
- "What features do users like most?"
- "Are there any country-specific issues?"
- "What improvements do users suggest?"

## Development Notes

### Mock Data
- Development mode automatically uses mock RAG responses
- Real API integration ready for production
- Easy to customize mock responses for testing

### Styling
- Consistent with app's design system
- iOS-style button interactions
- Responsive layout for different screen sizes
- Smooth animations and transitions

### Error Handling
- Network error fallbacks
- User-friendly error messages
- Graceful degradation when services unavailable

## Future Enhancements

- Chat history persistence
- Export chat conversations
- Voice input support
- Advanced filtering options
- Review sentiment analysis
- Trend visualization in chat
- Multi-language support

## Integration Points

- **Success Screen**: Entry point via "Chat with AI Assistant" button
- **App State**: Integrates with existing app flow management
- **API Services**: Extends existing service layer
- **Types**: Extends shared type definitions
- **UI Components**: Uses existing design system components
