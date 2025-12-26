/**
 * Service Factory
 * Manages service instances and switches between real and mock implementations
 */

import { FEATURES } from '@/config/constants';
import {
  MarketDataService,
  MockMarketDataService,
} from './marketDataService';
import {
  SentimentAnalysisService,
  MockSentimentAnalysisService,
} from './sentimentService';
import {
  WhatsAppService,
  MockWhatsAppService,
} from './whatsappService';

/**
 * Get the appropriate Market Data Service based on feature flags
 */
export const getMarketDataService = () => {
  if (FEATURES.ENABLE_REAL_API) {
    return MarketDataService;
  }
  return MockMarketDataService;
};

/**
 * Get the appropriate Sentiment Analysis Service based on feature flags
 */
export const getSentimentService = () => {
  if (FEATURES.ENABLE_REAL_API) {
    return SentimentAnalysisService;
  }
  return MockSentimentAnalysisService;
};

/**
 * Get the appropriate WhatsApp Service based on feature flags
 */
export const getWhatsAppService = () => {
  if (FEATURES.ENABLE_REAL_API && FEATURES.ENABLE_WHATSAPP) {
    return WhatsAppService;
  }
  return MockWhatsAppService;
};

/**
 * Service status checker
 */
export class ServiceHealth {
  /**
   * Check if all services are healthy
   */
  static async checkAllServices(): Promise<{
    marketData: boolean;
    sentiment: boolean;
    whatsapp: boolean;
  }> {
    const results = {
      marketData: false,
      sentiment: false,
      whatsapp: false,
    };

    try {
      // Check market data service
      const marketService = getMarketDataService();
      await marketService.getCurrentPrice();
      results.marketData = true;
    } catch (error) {
      console.error('[ServiceHealth] Market data service check failed:', error);
    }

    try {
      // Check sentiment service
      const sentimentService = getSentimentService();
      await sentimentService.analyzeSentiment('test');
      results.sentiment = true;
    } catch (error) {
      console.error('[ServiceHealth] Sentiment service check failed:', error);
    }

    try {
      // Check WhatsApp service
      const whatsappService = getWhatsAppService();
      results.whatsapp = await whatsappService.testConnection('test-key');
    } catch (error) {
      console.error('[ServiceHealth] WhatsApp service check failed:', error);
    }

    return results;
  }

  /**
   * Get service mode information
   */
  static getServiceMode(): {
    mode: 'production' | 'development';
    usingRealApi: boolean;
    enabledFeatures: string[];
  } {
    const enabledFeatures = Object.entries(FEATURES)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => feature);

    return {
      mode: FEATURES.ENABLE_REAL_API ? 'production' : 'development',
      usingRealApi: FEATURES.ENABLE_REAL_API,
      enabledFeatures,
    };
  }
}

// Export convenience instances
export const marketDataService = getMarketDataService();
export const sentimentService = getSentimentService();
export const whatsappService = getWhatsAppService();
