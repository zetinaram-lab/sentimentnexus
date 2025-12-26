/**
 * Global Constants for SentimentNexus
 * Centralized configuration values
 */

/**
 * Market Simulation Constants
 */
export const MARKET_CONFIG = {
  PRICE_BOUNDS: { min: 2500, max: 2800 },
  BASE_VOLATILITY: 1.5,
  TREND_MOMENTUM: 0.7,
  EVENT_IMPACT_MULTIPLIER: 2.5,
  HIGH_RELIABILITY_BONUS: 1.5,
  MAX_TREND_DURATION: 10,
  TREND_SHIFT_BASE_PROBABILITY: 0.05,
} as const;

/**
 * Data Retention Limits
 */
export const DATA_LIMITS = {
  MAX_EVENTS: 50,
  MAX_PRICE_POINTS: 100,
  MAX_STORED_SIGNALS: 100,
} as const;

/**
 * Timing Constants (in milliseconds)
 */
export const TIMING = {
  DATA_STREAM_INTERVAL: 2000,
  CHART_UPDATE_INTERVAL: 100,
  TOAST_DURATION: 3000,
} as const;

/**
 * localStorage Keys
 */
export const STORAGE_KEYS = {
  WHATSAPP_CONFIG: 'sentinelnexus_whatsapp_config',
  ALPHA_SIGNALS: 'sentinelnexus_alpha_signals',
  TERMINAL_SESSION: 'sentinelnexus_session',
  USER_PREFERENCES: 'sentinelnexus_preferences',
} as const;

/**
 * API Configuration (for future real API integration)
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.sentimentnexus.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    MARKET_DATA: '/api/v1/market/xauusd',
    NEWS_FEED: '/api/v1/news',
    SENTIMENT: '/api/v1/sentiment',
    WHATSAPP: '/api/v1/integrations/whatsapp',
  },
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  ENABLE_MOCK_DATA: true,
  ENABLE_ANALYTICS: false,
  ENABLE_WHATSAPP: true,
  ENABLE_EXPORT: true,
  ENABLE_REAL_API: false, // Toggle when ready to connect real APIs
} as const;

/**
 * Chart Configuration
 */
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 400,
  ANIMATION_DURATION: 300,
  COLORS: {
    PRICE_LINE: 'hsl(var(--primary))',
    VOLUME_BAR: 'hsl(var(--muted))',
    BULLISH_EVENT: 'hsl(142, 76%, 36%)',
    BEARISH_EVENT: 'hsl(0, 84%, 60%)',
    NEUTRAL_EVENT: 'hsl(47, 96%, 53%)',
  },
} as const;

/**
 * WhatsApp Integration Limits
 */
export const WHATSAPP_CONFIG = {
  MIN_API_KEY_LENGTH: 20,
  MAX_MESSAGE_LENGTH: 4096,
  RATE_LIMIT_MESSAGES_PER_MINUTE: 10,
} as const;
