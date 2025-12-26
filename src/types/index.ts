/**
 * Core Type Definitions for SentimentNexus
 * Defines all data structures used across the intelligence terminal
 */

/**
 * Market Event - Represents a news item or rumor from intelligence feed
 */
export interface MarketEvent {
  /** Unique identifier for the event */
  id: string;
  /** When the event was received/published */
  timestamp: Date;
  /** The actual news content or rumor text */
  content: string;
  /** Origin of the intelligence (Reuters, Bloomberg, etc.) */
  source: string;
  /** Assessed reliability of the source/information */
  reliability: 'high' | 'medium' | 'low';
  /** Expected market impact direction */
  impact: 'bullish' | 'bearish' | 'neutral';
}

/**
 * Price Point - Single data point in the price time series
 */
export interface PricePoint {
  /** Timestamp of this price reading */
  timestamp: Date;
  /** XAU/USD price value */
  price: number;
  /** Trading volume at this point */
  volume: number;
  /** Associated event ID if price was influenced by an event */
  eventId?: string;
}

/**
 * Alpha Signal - Detected correlation between event and price movement
 */
export interface AlphaSignal {
  /** Reference to the triggering event */
  eventId: string;
  /** When the triggering event occurred */
  eventTimestamp: Date;
  /** When the correlated price change was detected */
  priceChangeTimestamp: Date;
  /** Time difference in seconds (the "alpha" lag) */
  lagSeconds: number;
  /** Magnitude of price change */
  priceChange: number;
  /** Direction of the price movement */
  direction: 'up' | 'down';
  /** Correlation score (0-100) - how well event predicted movement */
  correlationScore?: number;
}

export interface WhatsAppConfig {
  apiKey: string;
  webhookUrl: string;
  isEnabled: boolean;
}
