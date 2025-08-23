import { getStoredToken } from './auth';

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
