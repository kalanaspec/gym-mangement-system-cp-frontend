import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extracts error message from HTTP error response
 * Handles various error response formats from the backend
 */
export function getErrorMessage(error: any): string {
  if (!error) {
    return 'An unexpected error occurred';
  }

  // Handle HttpErrorResponse
  if (error instanceof HttpErrorResponse) {
    // Try error.error.error (common backend format: { error: "message" })
    if (error.error?.error) {
      return error.error.error;
    }
    
    // Try error.error.message
    if (error.error?.message) {
      return error.error.message;
    }
    
    // Try error.message for generic HTTP errors
    if (error.message) {
      return error.message;
    }
    
    // Fallback to status text
    if (error.statusText) {
      return error.statusText;
    }
  }
  
  // Handle plain error objects
  if (typeof error === 'object') {
    if (error.error) {
      return error.error;
    }
    if (error.message) {
      return error.message;
    }
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Final fallback
  return 'An unexpected error occurred';
}

