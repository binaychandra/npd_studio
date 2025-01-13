import { ProductOutput, WeeklyData, PredictionData, AIQueryResponse } from '../types';

const BASE_URL = 'https://binaychandra-npdstudio-predapi.hf.space'

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchPredictionData = async (): Promise<PredictionData> => {
  try {
    const response = await fetch(`${BASE_URL}/get_prediction`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return handleApiResponse<PredictionData>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch prediction data: ${error.message}`);
    }
    throw new Error('Failed to fetch prediction data');
  }
};

export const fetchProductData = async (productId: string, weekDate: string): Promise<ProductOutput> => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const predictionData = await fetchPredictionData();
    
    // Convert prediction data to weekly data format
    const weeklyData: WeeklyData[] = Object.entries(predictionData)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([key, value]) => ({
        week: `Period ${key}`,
        value: Number(value.toFixed(2))
      }));

    return {
      productId,
      scenarioName: `Scenario ${productId}`,
      weeklyData,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch product data: ${error.message}`);
    }
    throw new Error('Failed to fetch product data');
  }
};

export const queryAI = async (query: string): Promise<AIQueryResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/query_ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    return handleApiResponse<AIQueryResponse>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
    throw new Error('Failed to get AI response');
  }
};