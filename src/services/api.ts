import {
  ProductOutput,
  AIQueryResponse,
  ProductForm,
  ProductSubmissionResponse,
  PredictionResponse,
  SimilarityResponse
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

// export const fetchPredictionData = async (): Promise<PredictionData> => {
//   try {
//     console.log('Fetching prediction data from API');
//     const response = await fetch(`${BASE_URL}/get_prediction`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//     });
//     return handleApiResponse<PredictionData>(response);
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(`Failed to fetch prediction data: ${error.message}`);
//     }
//     throw new Error('Failed to fetch prediction data');
//   }
// };

export const fetchProductData = async (productId: string, weekDate: string): Promise<ProductOutput> => {
  try {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    console.log('Fetching prediction data for productId:', productId, 'and weekDate:', weekDate);
    const response = await fetch(`${BASE_URL}/get_prediction_on_userinput`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ id: productId, weekDate })
    });

    const responseData = await handleApiResponse<ProductSubmissionResponse>(response);

    if (responseData.status === 'error' || !responseData.data) {
      throw new Error(responseData.error || 'Failed to fetch prediction data');
    }
    console.log('======Received product data for similarity:=======', responseData.data.similarity);
    return {
      productId,
      scenarioName: `Scenario ${productId}`,
      predictionData: responseData.data.predictions,
      similarityData: responseData.data.similarity

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
    // Transform the data to match the FastAPI expected format
    const transformedData = {
      id: form.id,
      isMinimized: form.isMinimized,
      country: form.country || '',
      category: form.category || '',
      basecode: form.baseCode,
      scenario: form.scenario,
      weekDate: form.weekDate,
      packGroup: form.packGroup,
      productRange: form.productRange,
      baseNumberInMultipack: form.baseNumberInMultipack,
      segment: form.segment,
      superSegment: form.superSegment,
      salty: form.salty,
      choco: form.choco,
      flavor: form.flavor,
      levelOfSugar: form.levelOfSugar,
      listPricePerUnitMl: Number(form.listPricePerUnitMl),
      weightPerUnitMl: Number(form.weightPerUnitMl),
      similarityData: form.similarityData || {},
      sampleOutput: true
    };

    console.log('Submitting product details with transformed data:', transformedData);
    const response = await fetch(`${BASE_URL}/get_prediction_on_userinput`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(transformedData),
    });
    
    const responseData = await handleApiResponse<{
      status: 'success' | 'error';
      error?: string;
      data?: {
        id: string;
        predictions: PredictionResponse;
        similarity: SimilarityResponse; // Update type here
      };
    }>(response);

    console.log('Received response similarity---:', responseData.data?.similarity);

    if (responseData.status === 'success' && responseData.data) {
      const { predictions, similarity } = responseData.data;
      
      // Validate predictions and similarity_attr
      const hasAllRetailers = (
        predictions.ASDA &&
        predictions.MORRISONS &&
        predictions.SAINSBURYS &&
        predictions.TESCO &&
        predictions.TOTAL_MARKET &&
        typeof predictions.ASDA === 'object' &&
        typeof predictions.MORRISONS === 'object' &&
        typeof predictions.SAINSBURYS === 'object' &&
        typeof predictions.TESCO === 'object' &&
        typeof predictions.TOTAL_MARKET === 'object'
      );

      const hasSimilarityData = similarity && Object.keys(similarity).length > 0;

      if (!hasAllRetailers || !hasSimilarityData) {
        console.error('Invalid data structure:', { predictions, similarity });
        return {
          status: 'error',
          error: 'Invalid data structure',
          data: undefined
        };
      } else {
        console.log('Valid data received:', { 
          predictions: predictions,
          similarity: similarity 
        });
      }

      return {
        status: 'success',
        error: undefined,
        data: {
          id: responseData.data.id,
          predictions: predictions,
          similarity: similarity,
          form: {
            ...transformedData,
            similarityData: similarity,
            predictionData: predictions
          }
        }
      };
    }

    return {
      status: responseData.status,
      error: responseData.error || 'No data available',
      data: undefined
    };
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