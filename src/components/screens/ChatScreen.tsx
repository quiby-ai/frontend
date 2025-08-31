import React, { useState, useRef, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimpleMascot } from '@/components/mascot/SimpleMascot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProcessingResults, ChatMessage, RAGQuery } from '@/types';
import { sendRAGQuery } from '@/services/api';
import { Send, ArrowLeft, Star, Globe, Calendar, MessageCircle, Loader2 } from 'lucide-react';

interface ChatScreenProps {
  results: ProcessingResults;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ results, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Quiby here 👋 I'm here to help you analyze reviews of ${results.app.name}. I can help you explore insights from the ${results.reviewsCount.toLocaleString()} reviews we've processed. What would you like to know?`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare RAG query
      const ragQuery: RAGQuery = {
        query: userQuery,
        sagaId: results.sagaId,
        appId: results.app.id,
        countries: results.countries,
      };

      // Send query to RAG service
      const response = await sendRAGQuery(ragQuery);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        retrievedReviews: response.retrievedReviews,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('RAG query error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please check your connection and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <AppLayout className="bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--accent-light))]">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3 flex-1">
            <SimpleMascot state="search" size="sm" />
            <div>
              <h1 className="font-semibold text-[rgb(var(--text-primary))] ios-text">
                AI Chat Assistant
              </h1>
              <p className="text-sm text-[rgb(var(--text-secondary))] ios-text">
                {results.app.name} • {results.reviewsCount.toLocaleString()} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 p-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] space-y-3 ${
                  message.type === 'user'
                    ? 'bg-[rgb(var(--primary))] text-white'
                    : 'bg-[rgb(var(--surface))] border border-[rgb(var(--border))]'
                } rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-sm)]`}
              >
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed ios-text">
                    {message.content}
                  </p>
                  
                  {message.retrievedReviews && (
                    <div className="space-y-3 pt-3 border-t border-[rgb(var(--border))]">
                      <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-secondary))] ios-text">
                        <MessageCircle className="w-3 h-3" />
                        <span>Retrieved Reviews</span>
                      </div>
                      
                      {message.retrievedReviews.map((review) => (
                        <Card key={review.id} className="bg-[rgb(var(--background))] border-[rgb(var(--border))]">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {renderStars(review.rating)}
                                <span className="text-xs font-medium text-[rgb(var(--text-primary))] ios-text">
                                  {review.rating}/5
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-secondary))] ios-text">
                                <Globe className="w-3 h-3" />
                                <span>{review.country}</span>
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(review.date)}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-[rgb(var(--text-primary))] ios-text leading-relaxed">
                              {review.content}
                            </p>
                            {review.helpfulCount && (
                              <div className="flex items-center gap-1 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  👍 {review.helpfulCount} helpful
                                </Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="text-xs opacity-70 ios-text">
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-[rgb(var(--text-secondary))] ios-text">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the reviews, trends, or insights..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))] hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-[rgb(var(--text-muted))] ios-text mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
