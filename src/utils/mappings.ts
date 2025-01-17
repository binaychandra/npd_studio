// Country code mappings
export const COUNTRY_CODES = {
  'united-kingdom': 'GB01'
} as const;

// Category code mappings
export const CATEGORY_CODES = {
  'biscuits': 'EUBI',
  'chocolate': 'EUCO',
  'gum-candy': 'EUGC',
  'cheese': 'EUCH'
} as const;

// Reverse mappings for display purposes
export const COUNTRY_NAMES = {
  'GB01': 'United Kingdom'
} as const;

export const CATEGORY_NAMES = {
  'EUBI': 'Biscuits',
  'EUCO': 'Chocolate',
  'EUGC': 'Gum & Candy',
  'EUCH': 'Cheese'
} as const;

export type CountryCode = keyof typeof COUNTRY_NAMES;
export type CategoryCode = keyof typeof CATEGORY_NAMES;

// Helper function to get config section based on country and category
export const getConfigSection = (countryCode: CountryCode, categoryCode: CategoryCode) => {
  return `${countryCode}.${categoryCode}`;
};