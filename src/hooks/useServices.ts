/**
 * useServices Hook
 * Provides easy access to all API services with loading and error states
 */

import { useState, useCallback } from 'react';
import {
  marketDataService,
  sentimentService,
  whatsappService,
  ServiceHealth,
} from '@/services';
import {
  MarketDataResponse,
  HistoricalDataParams,
} from '@/services/marketDataService';
import { NewsItem, NewsFeedParams } from '@/services/sentimentService';
import { WhatsAppMessage, AlertConfig } from '@/services/whatsappService';
import { AlphaSignal, MarketEvent, PricePoint } from '@/types';

interface UseServicesReturn {
  // Market Data
  getCurrentPrice: () => Promise<MarketDataResponse | null>;
  getHistoricalData: (params: HistoricalDataParams) => Promise<PricePoint[] | null>;
  
  // Sentiment Analysis
  getNewsFeed: (params?: NewsFeedParams) => Promise<NewsItem[] | null>;
  analyzeNews: (newsItems: NewsItem[]) => Promise<MarketEvent[] | null>;
  
  // WhatsApp
  sendWhatsAppMessage: (message: WhatsAppMessage) => Promise<boolean>;
  sendAlphaAlert: (
    signal: AlphaSignal,
    event: MarketEvent,
    config: AlertConfig
  ) => Promise<boolean>;
  
  // Health Check
  checkServiceHealth: () => Promise<void>;
  
  // State
  isLoading: boolean;
  error: Error | null;
  serviceHealth: {
    marketData: boolean;
    sentiment: boolean;
    whatsapp: boolean;
  } | null;
}

export const useServices = (): UseServicesReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [serviceHealth, setServiceHealth] = useState<{
    marketData: boolean;
    sentiment: boolean;
    whatsapp: boolean;
  } | null>(null);

  /**
   * Get current market price
   */
  const getCurrentPrice = useCallback(async (): Promise<MarketDataResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await marketDataService.getCurrentPrice();
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get current price');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get historical market data
   */
  const getHistoricalData = useCallback(
    async (params: HistoricalDataParams): Promise<PricePoint[] | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await marketDataService.getHistoricalData(params);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get historical data');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get news feed
   */
  const getNewsFeed = useCallback(
    async (params?: NewsFeedParams): Promise<NewsItem[] | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await sentimentService.getNewsFeed(params);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get news feed');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Analyze news items
   */
  const analyzeNews = useCallback(
    async (newsItems: NewsItem[]): Promise<MarketEvent[] | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const events = await sentimentService.batchAnalyzeNews(newsItems);
        return events;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to analyze news');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Send WhatsApp message
   */
  const sendWhatsAppMessage = useCallback(
    async (message: WhatsAppMessage): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await whatsappService.sendMessage(message);
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to send message');
        setError(error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Send alpha signal alert via WhatsApp
   */
  const sendAlphaAlert = useCallback(
    async (
      signal: AlphaSignal,
      event: MarketEvent,
      config: AlertConfig
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await whatsappService.sendAlphaSignalAlert(signal, event, config);
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to send alpha alert');
        setError(error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Check health of all services
   */
  const checkServiceHealth = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const health = await ServiceHealth.checkAllServices();
      setServiceHealth(health);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check service health');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getCurrentPrice,
    getHistoricalData,
    getNewsFeed,
    analyzeNews,
    sendWhatsAppMessage,
    sendAlphaAlert,
    checkServiceHealth,
    isLoading,
    error,
    serviceHealth,
  };
};
