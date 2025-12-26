/**
 * API Client
 * Centralized HTTP client with interceptors, retry logic, and error handling
 */

import { API_CONFIG } from '@/config/constants';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

/**
 * Custom API Error class
 */
export class ApiClientError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Retry configuration
 */
interface RetryConfig {
  attempts: number;
  delay: number;
  shouldRetry: (error: ApiClientError) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  attempts: API_CONFIG.RETRY_ATTEMPTS,
  delay: 1000,
  shouldRetry: (error) => {
    // Retry on network errors and 5xx server errors
    return error.status >= 500 || error.status === 0;
  },
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Make HTTP request with retry logic
 */
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retryConfig: RetryConfig = defaultRetryConfig
): Promise<ApiResponse<T>> {
  let lastError: ApiClientError | null = null;

  for (let attempt = 0; attempt < retryConfig.attempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiClientError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code,
          errorData
        );
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        message: data.message,
      };
    } catch (error) {
      if (error instanceof ApiClientError) {
        lastError = error;
      } else if (error instanceof Error) {
        lastError = new ApiClientError(
          error.name === 'AbortError' ? 'Request timeout' : error.message,
          0
        );
      } else {
        lastError = new ApiClientError('Unknown error occurred', 0);
      }

      // Check if we should retry
      if (
        attempt < retryConfig.attempts - 1 &&
        retryConfig.shouldRetry(lastError)
      ) {
        await sleep(retryConfig.delay * (attempt + 1)); // Exponential backoff
        continue;
      }

      // Don't retry, throw the error
      throw lastError;
    }
  }

  throw lastError!;
}

/**
 * API Client class
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Remove authentication token
   */
  clearAuthToken(): void {
    const { Authorization, ...rest } = this.defaultHeaders as Record<string, string>;
    this.defaultHeaders = rest;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return fetchWithRetry<T>(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options?.headers },
      ...options,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return fetchWithRetry<T>(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { ...this.defaultHeaders, ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return fetchWithRetry<T>(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: { ...this.defaultHeaders, ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return fetchWithRetry<T>(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: { ...this.defaultHeaders, ...options?.headers },
      ...options,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return fetchWithRetry<T>(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: { ...this.defaultHeaders, ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
