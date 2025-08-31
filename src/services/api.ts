import { getStoredToken } from './auth';
import { RAGQuery, RAGResponse, RetrievedReview } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface AnalysisRequest {
  app_id: string;
  app_name: string;
  countries: string[];
  date_from: string;
  date_to: string;
}

export interface AnalysisResponse {
  saga_id: string;
  status: string;
}

export const startAnalysis = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await fetch(`${API_BASE_URL}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analysis request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: AnalysisResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Analysis request error:', error);
    throw error;
  }
};

export const sendRAGQuery = async (query: RAGQuery): Promise<RAGResponse> => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await fetch(`${API_BASE_URL}/rag/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RAG query failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: RAGResponse = await response.json();
    return data;
  } catch (error) {
    console.error('RAG query error:', error);
    
    // Fallback to mock data for development
    if (import.meta.env.DEV) {
      console.log('Using mock RAG response for development');
      return getMockRAGResponse(query);
    }
    
    throw error;
  }
};

// Mock RAG response for development
const getMockRAGResponse = (query: RAGQuery): RAGResponse => {
  const mockReviews: RetrievedReview[] = [
    {
      id: '1',
      content: 'This app has really improved my productivity. The interface is intuitive and the features are exactly what I needed for my daily workflow.',
      rating: 5,
      country: 'United States',
      date: '2024-01-15',
      helpfulCount: 12
    },
    {
      id: '2',
      content: 'Great functionality but the app crashes occasionally on older devices. Hope this gets fixed in future updates. Overall satisfied with the core features.',
      rating: 4,
      country: 'Germany',
      date: '2024-01-10',
      helpfulCount: 8
    },
    {
      id: '3',
      content: 'The customer support is excellent and the app works perfectly for my use case. Highly recommended for anyone looking for a reliable solution.',
      rating: 5,
      country: 'Canada',
      date: '2024-01-08',
      helpfulCount: 15
    }
  ];

  const mockAnswers = [
    `Based on your query about "${query.query}", I found several relevant reviews that provide valuable insights. Users across different countries have shared their experiences, and here are the key findings:`,
    `Great question! Looking at the reviews related to "${query.query}", I can see some interesting patterns. Here are the most relevant user experiences:`,
    `I've analyzed the reviews for "${query.query}" and found some compelling feedback. Here are the top insights from users:`
  ];

  return {
    answer: mockAnswers[Math.floor(Math.random() * mockAnswers.length)],
    retrievedReviews: mockReviews,
    confidence: 0.85 + Math.random() * 0.1,
    processingTime: 1200 + Math.random() * 800
  };
};

export const getRAGHistory = async (sagaId: string): Promise<RAGResponse[]> => {
  try {
    const token = getStoredToken();
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await fetch(`${API_BASE_URL}/rag/history/${sagaId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch RAG history: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: RAGResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('RAG history fetch error:', error);
    throw error;
  }
};
