import { ReactNode } from 'react';

export interface Country {
  id: string;
  name: string;
  mapUrl: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface ClientData {
  clientId: string;
  distribution: number[];
}

export interface ProductForm {
  id: string;
  baseCode: string;
  scenario: string;
  retailer?: string;
  weekDate: string;
  levelOfSugar: string;
  packGroup: string;
  productRange: string;
  segment: string;
  superSegment: string;
  baseNumberInMultipack: string;
  flavor: string;
  choco: string;
  salty: string;
  weightPerUnitMl: number;
  listPricePerUnitMl: number;
  isMinimized: boolean;
  isDetailedModel?: boolean;
  country?: string;
  category?: string;
  predictionData?: PredictionResponse;
  similarityData?: SimilarityResponse;
}


export interface RetailerData {
  [month: string]: number;
}

export interface PredictionResponse {
  ASDA: RetailerData;
  MORRISONS: RetailerData;
  SAINSBURYS: RetailerData;
  TESCO: RetailerData;
  TOTAL_MARKET: RetailerData;
}

// Fix the SimilarityResponse interface syntax
export interface SimilarityResponse {
  [key: string]: {
    description: string;
    sell_in_volume: number;
    similarity: number;
    distribution: number[];
    week_date: string[];
  };
}

// export interface WeeklyData {
//   week: string;
//   value: number;
// }

export interface ProductOutput {
  productId: string;
  scenarioName: string;
  predictionData: PredictionResponse | null;
  similarityData: SimilarityResponse | null;
}

export interface FormState {
  selectedCountry: string | null;
  selectedCategory: string | null;
  forms: ProductForm[];
}

export interface FormGroupProps {
  title: string;
  children: ReactNode;
}

// Old format prediction data
export type PredictionData = {
  [key: string]: number;
} | PredictionResponse;

export interface AIQueryResponse {
  status: 'success' | 'error';
  error?: string;
  data?: {
    baseCode?: string;
    scenario?: string;
    weekDate?: string;
    levelOfSugar?: string;
    packGroup?: string;
    productRange?: string;
    segment?: string;
    superSegment?: string;
    baseNumberInMultipack?: string;
    flavor?: string;
    choco?: string;
    salty?: string;
    weightPerUnitMl?: number;
    listPricePerUnitMl?: number;
  };
}

// Update ProductSubmissionResponse to properly type similarity_attr
export interface ProductSubmissionResponse {
  status: 'success' | 'error';
  error?: string;
  data?: {
    id: string;
    predictions: PredictionResponse;
    similarity: SimilarityResponse; // Make this required, not optional
    form: ProductForm & {
      predictionData: PredictionResponse;
      similarityData: SimilarityResponse;
    };
  };
}