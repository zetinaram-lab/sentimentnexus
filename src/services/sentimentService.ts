/**
 * Sentiment Analysis Service
 * Analyzes news content and determines market impact
 */

import { apiClient } from './apiClient';
import { API_CONFIG } from '@/config/constants';
import { MarketEvent } from '@/types';

/**
 * Sentiment analysis result from API
 */
export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1
  impact: 'bullish' | 'bearish' | 'neutral';
  keywords: string[];
  entities: {
    type: 'organization' | 'person' | 'location' | 'currency';
    name: string;
    relevance: number;
  }[];
}

/**
 * News item from feed
 */
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: string;
  url?: string;
  imageUrl?: string;
}

/**
 * News feed request params
 */
export interface NewsFeedParams {
  category?: 'gold' | 'forex' | 'commodities' | 'crypto';
  sources?: string[];
  limit?: number;
  since?: string;
}

/**
 * Sentiment Analysis Service
 */
export class SentimentAnalysisService {
  /**
   * Analyze sentiment of a text
   */
  static async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    try {
      const response = await apiClient.post<SentimentAnalysisResult>(
        `${API_CONFIG.ENDPOINTS.SENTIMENT}/analyze`,
        { text }
      );
      return response.data;
    } catch (error) {
      console.error('[SentimentAnalysisService] Failed to analyze sentiment:', error);
      throw error;
    }
  }

  /**
   * Get news feed with sentiment analysis
   */
  static async getNewsFeed(params?: NewsFeedParams): Promise<NewsItem[]> {
    try {
      const queryParams = new URLSearchParams({
        ...(params?.category && { category: params.category }),
        ...(params?.limit && { limit: params.limit.toString() }),
        ...(params?.since && { since: params.since }),
      });

      if (params?.sources) {
        params.sources.forEach((source) => {
          queryParams.append('sources', source);
        });
      }

      const response = await apiClient.get<NewsItem[]>(
        `${API_CONFIG.ENDPOINTS.NEWS_FEED}?${queryParams}`
      );

      return response.data;
    } catch (error) {
      console.error('[SentimentAnalysisService] Failed to fetch news feed:', error);
      throw error;
    }
  }

  /**
   * Convert news item to market event with sentiment
   */
  static async convertNewsToEvent(newsItem: NewsItem): Promise<MarketEvent> {
    try {
      const sentiment = await this.analyzeSentiment(
        `${newsItem.title}. ${newsItem.content}`
      );

      // Map sentiment confidence to reliability
      let reliability: MarketEvent['reliability'];
      if (sentiment.confidence >= 0.8) {
        reliability = 'high';
      } else if (sentiment.confidence >= 0.5) {
        reliability = 'medium';
      } else {
        reliability = 'low';
      }

      return {
        id: newsItem.id,
        timestamp: new Date(newsItem.publishedAt),
        content: newsItem.title,
        source: newsItem.source,
        reliability,
        impact: sentiment.impact,
      };
    } catch (error) {
      console.error('[SentimentAnalysisService] Failed to convert news to event:', error);
      throw error;
    }
  }

  /**
   * Batch analyze multiple news items
   */
  static async batchAnalyzeNews(newsItems: NewsItem[]): Promise<MarketEvent[]> {
    try {
      const events = await Promise.all(
        newsItems.map((item) => this.convertNewsToEvent(item))
      );
      return events;
    } catch (error) {
      console.error('[SentimentAnalysisService] Failed to batch analyze news:', error);
      throw error;
    }
  }
}

/**
 * Mock Sentiment Analysis Service (for development/testing)
 */
export class MockSentimentAnalysisService {
  static async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simple keyword-based mock analysis
    const bullishKeywords = ['increase', 'surge', 'bullish', 'buy', 'rally', 'growth'];
    const bearishKeywords = ['decrease', 'drop', 'bearish', 'sell', 'decline', 'fall'];

    const lowerText = text.toLowerCase();
    const hasBullish = bullishKeywords.some((kw) => lowerText.includes(kw));
    const hasBearish = bearishKeywords.some((kw) => lowerText.includes(kw));

    let sentiment: SentimentAnalysisResult['sentiment'];
    let impact: SentimentAnalysisResult['impact'];

    if (hasBullish && !hasBearish) {
      sentiment = 'positive';
      impact = 'bullish';
    } else if (hasBearish && !hasBullish) {
      sentiment = 'negative';
      impact = 'bearish';
    } else {
      sentiment = 'neutral';
      impact = 'neutral';
    }

    return {
      sentiment,
      confidence: 0.7 + Math.random() * 0.3,
      impact,
      keywords: [
        ...bullishKeywords.filter((kw) => lowerText.includes(kw)),
        ...bearishKeywords.filter((kw) => lowerText.includes(kw)),
      ],
      entities: [],
    };
  }

  static async getNewsFeed(params?: NewsFeedParams): Promise<NewsItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Mock news items
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Gold prices surge as dollar weakens',
        content: 'Gold prices increased by 2% today following dollar weakness...',
        source: 'Reuters',
        publishedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Central banks increase gold reserves',
        content: 'Major central banks continue to accumulate gold reserves...',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    return mockNews.slice(0, params?.limit || 10);
  }

  static async convertNewsToEvent(newsItem: NewsItem): Promise<MarketEvent> {
    const sentiment = await this.analyzeSentiment(newsItem.title);

    let reliability: MarketEvent['reliability'];
    if (sentiment.confidence >= 0.8) {
      reliability = 'high';
    } else if (sentiment.confidence >= 0.5) {
      reliability = 'medium';
    } else {
      reliability = 'low';
    }

    return {
      id: newsItem.id,
      timestamp: new Date(newsItem.publishedAt),
      content: newsItem.title,
      source: newsItem.source,
      reliability,
      impact: sentiment.impact,
    };
  }

  static async batchAnalyzeNews(newsItems: NewsItem[]): Promise<MarketEvent[]> {
    const events = await Promise.all(
      newsItems.map((item) => this.convertNewsToEvent(item))
    );
    return events;
  }
}
