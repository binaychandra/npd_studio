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
  weekDate: string;
  levelOfSugar: string;
  packGroup: string;
  productRange: string;
  segment: string;
  superSegment: string;
  baseNumberInMultipack: number;
  flavor: string;
  choco: string;
  salty: string;
  weightPerUnitMl: number;
  listPricePerUnitMl: number;
  isMinimized: boolean;
  isDetailedModel?: boolean;
}

export interface WeeklyData {
  week: string;
  value: number;
}

export interface ProductOutput {
  productId: string;
  scenarioName: string;
  weeklyData: WeeklyData[];
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

export type PredictionData = Record<string, number>;

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
    baseNumberInMultipack?: number;
    flavor?: string;
    choco?: string;
    salty?: string;
    weightPerUnitMl?: number;
    listPricePerUnitMl?: number;
  };
}