export interface MarketEvent {
  id: string;
  timestamp: Date;
  content: string;
  source: string;
  reliability: 'high' | 'medium' | 'low';
  impact: 'bullish' | 'bearish' | 'neutral';
}

export interface PricePoint {
  timestamp: Date;
  price: number;
  volume: number;
  eventId?: string;
}

export interface AlphaSignal {
  eventId: string;
  eventTimestamp: Date;
  priceChangeTimestamp: Date;
  lagSeconds: number;
  priceChange: number;
  direction: 'up' | 'down';
}

export interface WhatsAppConfig {
  apiKey: string;
  webhookUrl: string;
  isEnabled: boolean;
}
