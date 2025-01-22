import {
  ProductOutput,
  WeeklyData,
  PredictionData,
  AIQueryResponse,
  ProductForm,
  ProductSubmissionResponse
} from '../types';

const BASE_URL = 'https://binaychandra-npdstudio-predapi.hf.space'

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const responseData = await response.json();
  console.log('API Response:', responseData);
  return responseData;
};

export const fetchPredictionData = async (): Promise<PredictionData> => {
  try {
    console.log('Fetching prediction data from API');
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

    console.log('Fetching prediction data for productId:', productId, 'and weekDate:', weekDate);
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
    console.log('Querying AI with:', query);
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

export const submitProductDetails = async (form: ProductForm): Promise<ProductSubmissionResponse> => {
  try {
    console.log('Submitting product details with form:', form);
    const response = await fetch(`${BASE_URL}/get_prediction_on_userinput`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(form),
    });
    return handleApiResponse<ProductSubmissionResponse>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to submit product details: ${error.message}`);
    }
    throw new Error('Failed to submit product details');
  }
};

export const submitAllProducts = async (forms: ProductForm[]): Promise<ProductSubmissionResponse[]> => {
  try {
    console.log('Submitting all products with forms:', forms);
    // Submit all products concurrently using Promise.all
    const responses = await Promise.all(
      forms.map(form => {
        console.log('Submitting product with form:', form);
        return submitProductDetails(form);
      })
    );
    return responses;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to submit products: ${error.message}`);
    }
    throw new Error('Failed to submit products');
  }
};