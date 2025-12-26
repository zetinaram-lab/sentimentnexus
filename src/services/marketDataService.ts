/**
 * Market Data Service
 * Handles XAU/USD price data fetching from real APIs
 */

import { apiClient, ApiResponse } from './apiClient';
import { API_CONFIG } from '@/config/constants';
import { PricePoint } from '@/types';

/**
 * Market data response from API
 */
export interface MarketDataResponse {
  symbol: string;
  price: number;
  timestamp: string;
  volume: number;
  bid: number;
  ask: number;
  high24h: number;
  low24h: number;
}

/**
 * Historical data request params
 */
export interface HistoricalDataParams {
  symbol: string;
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  limit?: number;
  startTime?: number;
  endTime?: number;
}

/**
 * Market Data Service
 */
export class MarketDataService {
  /**
   * Get current market price for XAU/USD
   */
  static async getCurrentPrice(): Promise<MarketDataResponse> {
    try {
      const response = await apiClient.get<MarketDataResponse>(
        API_CONFIG.ENDPOINTS.MARKET_DATA
      );
      return response.data;
    } catch (error) {
      console.error('[MarketDataService] Failed to fetch current price:', error);
      throw error;
    }
  }

  /**
   * Get historical price data
   */
  static async getHistoricalData(
    params: HistoricalDataParams
  ): Promise<PricePoint[]> {
    try {
      const queryParams = new URLSearchParams({
        symbol: params.symbol,
        interval: params.interval,
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.startTime && { startTime: params.startTime.toString() }),
        ...(params.endTime && { endTime: params.endTime.toString() }),
      });

      const response = await apiClient.get<MarketDataResponse[]>(
        `${API_CONFIG.ENDPOINTS.MARKET_DATA}/history?${queryParams}`
      );

      // Transform API response to PricePoint format
      return response.data.map((item) => ({
        timestamp: new Date(item.timestamp),
        price: item.price,
        volume: item.volume,
      }));
    } catch (error) {
      console.error('[MarketDataService] Failed to fetch historical data:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time price updates via WebSocket
   * Returns a cleanup function
   */
  static subscribeToRealTimeUpdates(
    symbol: string,
    onUpdate: (data: MarketDataResponse) => void,
    onError?: (error: Error) => void
  ): () => void {
    // This would be implemented with WebSocket
    // For now, return a mock subscription
    const wsUrl = API_CONFIG.BASE_URL.replace('https', 'wss');
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(`${wsUrl}/ws/market/${symbol}`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as MarketDataResponse;
          onUpdate(data);
        } catch (err) {
          console.error('[MarketDataService] Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        const error = new Error('WebSocket error');
        console.error('[MarketDataService] WebSocket error:', event);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('[MarketDataService] WebSocket connection closed');
      };
    } catch (error) {
      console.error('[MarketDataService] Failed to create WebSocket:', error);
      onError?.(error as Error);
    }

    // Return cleanup function
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }
}

/**
 * Mock Market Data Service (for development/testing)
 * Falls back to simulation when real API is not available
 */
export class MockMarketDataService {
  static async getCurrentPrice(): Promise<MarketDataResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      symbol: 'XAUUSD',
      price: 2650 + Math.random() * 50,
      timestamp: new Date().toISOString(),
      volume: Math.floor(Math.random() * 1000) + 500,
      bid: 2649.5,
      ask: 2650.5,
      high24h: 2680,
      low24h: 2620,
    };
  }

  static async getHistoricalData(
    params: HistoricalDataParams
  ): Promise<PricePoint[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const dataPoints: PricePoint[] = [];
    const now = Date.now();
    const limit = params.limit || 30;

    for (let i = limit; i >= 0; i--) {
      dataPoints.push({
        timestamp: new Date(now - i * 60000),
        price: 2650 + Math.random() * 50,
        volume: Math.floor(Math.random() * 1000) + 500,
      });
    }

    return dataPoints;
  }

  static subscribeToRealTimeUpdates(
    symbol: string,
    onUpdate: (data: MarketDataResponse) => void
  ): () => void {
    const interval = setInterval(() => {
      onUpdate({
        symbol,
        price: 2650 + Math.random() * 50,
        timestamp: new Date().toISOString(),
        volume: Math.floor(Math.random() * 1000) + 500,
        bid: 2649.5,
        ask: 2650.5,
        high24h: 2680,
        low24h: 2620,
      });
    }, 2000);

    return () => clearInterval(interval);
  }
}
