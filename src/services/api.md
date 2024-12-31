# API Service Documentation

## Overview
This service module handles API communication with the NPD Studio prediction API endpoint. It provides functions to fetch prediction data and product-specific data from the backend service.

## Base Configuration
- **Base URL**: `https://binaychandra-npdstudio-predapi.hf.space`
- **Content Type**: JSON
- **Accept**: JSON

## Type Imports
The service uses the following types from '../types':
- `ProductOutput`: Represents the output format for product data
- `WeeklyData`: Represents weekly data format
- `PredictionData`: Represents prediction data from the API

## Utility Functions

### handleApiResponse<T>
An internal utility function that handles API responses and error cases.

**Parameters:**
- `response: Response` - The fetch API response object

**Returns:**
- `Promise<T>` - Generic type T representing the parsed JSON response

**Error Handling:**
- Throws an error if the response is not OK (status code not in 200-299 range)
- Includes the error message from the API if available
- Falls back to HTTP status code if no specific error message is provided

## Exported Functions

### fetchPredictionData
Fetches prediction data from the API endpoint.

**Endpoint:** `GET /get_prediction`

**Returns:**
- `Promise<PredictionData>` - The prediction data from the API

**Error Handling:**
- Throws an error if the API request fails
- Includes the specific error message in the thrown error
- Provides a fallback error message if the error type is unknown

### fetchProductData
Fetches and processes product-specific data, combining it with prediction data.

**Parameters:**
- `productId: string` - The ID of the product to fetch data for
- `weekDate: string` - The week date for the prediction

**Returns:**
- `Promise<ProductOutput>` - Processed product data including:
  - productId
  - scenarioName
  - weeklyData (array of weekly predictions)

**Process:**
1. Validates that productId is provided
2. Fetches prediction data using fetchPredictionData
3. Converts prediction data to weekly data format
4. Formats and returns the final product output

**Error Handling:**
- Validates required parameters (throws error if productId is missing)
- Throws an error if the API request fails
- Includes the specific error message in the thrown error
- Provides a fallback error message if the error type is unknown

## Data Transformation
The service includes logic to transform raw prediction data into a weekly format:
- Sorts prediction data by period number
- Converts values to fixed decimal format (2 decimal places)
- Structures data into WeeklyData format with week labels ("Period X")

## Error Handling Strategy
The service implements a comprehensive error handling strategy:
1. Type-specific error handling using instanceof Error
2. Detailed error messages including the original error context
3. Fallback generic error messages for unknown error types
4. HTTP response validation and error extraction