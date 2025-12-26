/**
 * Market Simulation Engine for SentimentNexus
 * Provides realistic XAU/USD price movements with trend-following behavior
 * and event-driven reactions
 */

import { MarketEvent, PricePoint } from '@/types';

// Simulation Constants
const PRICE_BOUNDS = { min: 2500, max: 2800 } as const;
const BASE_VOLATILITY = 1.5;
const TREND_MOMENTUM = 0.7;
const EVENT_IMPACT_MULTIPLIER = 2.5;
const HIGH_RELIABILITY_BONUS = 1.5;

// News Sources with credibility weights
export const NEWS_SOURCES = [
  { name: 'Reuters', weight: 0.95 },
  { name: 'Bloomberg', weight: 0.92 },
  { name: 'Financial Times', weight: 0.88 },
  { name: 'WSJ', weight: 0.85 },
  { name: 'CNBC', weight: 0.75 },
  { name: 'ZeroHedge', weight: 0.60 },
] as const;

// Market Rumors Pool - Categorized by impact
export const MARKET_RUMORS = {
  bullish: [
    'Fed officials hint at potential rate pause in upcoming FOMC meeting',
    'Chinese central bank increases gold reserves for 18th consecutive month',
    'Geopolitical tensions escalate in Middle East, safe-haven demand rising',
    'Major hedge fund reportedly increasing gold allocation to 15%',
    'Dollar weakness expected as inflation data comes in softer than forecast',
    'Central banks worldwide accelerating gold purchases amid currency concerns',
    'ETF inflows surge to highest level since 2020 pandemic peak',
    'Swiss refiners report unprecedented demand from Asian buyers',
    'Physical gold premiums spike in Asian markets overnight',
    'Currency strategist warns of dollar devaluation risk',
  ],
  bearish: [
    'Strong US jobs report raises expectations for rate hikes',
    'Treasury yields surge to multi-year highs, pressuring gold',
    'Risk-on sentiment dominates as equity markets rally',
    'Fed governor signals hawkish stance on monetary policy',
    'Dollar index breaks above key resistance level',
    'Institutional investors rotating from gold to equities',
    'Mining production ramps up as new operations come online',
    'Options market shows significant put buying for near-term expiry',
  ],
  neutral: [
    'Technical breakout imminent as gold tests key resistance at $2,700',
    'Gold-to-S&P ratio signals potential market equilibrium',
    'Options market balanced between calls and puts',
    'Analysts divided on near-term gold price direction',
    'Trading volumes normalize after volatile session',
  ],
} as const;

/**
 * Market Trend State - Tracks current momentum
 */
interface TrendState {
  direction: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-1 scale
  duration: number; // How many ticks this trend has lasted
}

let currentTrend: TrendState = {
  direction: 'neutral',
  strength: 0.5,
  duration: 0,
};

/**
 * Calculate trend shift probability based on current state
 */
const calculateTrendShift = (): TrendState => {
  currentTrend.duration++;

  // Trends naturally decay over time
  if (currentTrend.duration > 10) {
    const shiftProbability = (currentTrend.duration - 10) * 0.05;
    if (Math.random() < shiftProbability) {
      const directions: TrendState['direction'][] = ['bullish', 'bearish', 'neutral'];
      return {
        direction: directions[Math.floor(Math.random() * directions.length)],
        strength: 0.3 + Math.random() * 0.5,
        duration: 0,
      };
    }
  }

  return currentTrend;
};

/**
 * Generate next price point with trend-following behavior
 */
export const generatePriceMovement = (
  currentPrice: number,
  pendingEvent: MarketEvent | null
): { price: number; momentum: number } => {
  currentTrend = calculateTrendShift();

  // Base random movement
  let movement = (Math.random() - 0.5) * BASE_VOLATILITY * 2;

  // Apply trend momentum
  if (currentTrend.direction === 'bullish') {
    movement += TREND_MOMENTUM * currentTrend.strength;
  } else if (currentTrend.direction === 'bearish') {
    movement -= TREND_MOMENTUM * currentTrend.strength;
  }

  // Apply event impact if pending high-reliability event
  if (pendingEvent && pendingEvent.reliability === 'high') {
    const impactMultiplier = EVENT_IMPACT_MULTIPLIER * HIGH_RELIABILITY_BONUS;
    if (pendingEvent.impact === 'bullish') {
      movement += impactMultiplier;
      currentTrend = { direction: 'bullish', strength: 0.8, duration: 0 };
    } else if (pendingEvent.impact === 'bearish') {
      movement -= impactMultiplier;
      currentTrend = { direction: 'bearish', strength: 0.8, duration: 0 };
    }
  } else if (pendingEvent && pendingEvent.reliability === 'medium') {
    const impactMultiplier = EVENT_IMPACT_MULTIPLIER * 0.6;
    if (pendingEvent.impact === 'bullish') {
      movement += impactMultiplier;
    } else if (pendingEvent.impact === 'bearish') {
      movement -= impactMultiplier;
    }
  }

  // Enforce price bounds with soft bounce
  let newPrice = currentPrice + movement;
  if (newPrice < PRICE_BOUNDS.min) {
    newPrice = PRICE_BOUNDS.min + Math.random() * 5;
    currentTrend.direction = 'bullish';
  } else if (newPrice > PRICE_BOUNDS.max) {
    newPrice = PRICE_BOUNDS.max - Math.random() * 5;
    currentTrend.direction = 'bearish';
  }

  return {
    price: newPrice,
    momentum: movement,
  };
};

/**
 * Generate a market event (rumor/news)
 */
export const generateMarketEvent = (): MarketEvent => {
  // Determine impact based on current trend (60% chance to follow trend)
  let impact: MarketEvent['impact'];
  if (Math.random() < 0.6) {
    impact = currentTrend.direction === 'neutral' 
      ? (['bullish', 'bearish', 'neutral'] as const)[Math.floor(Math.random() * 3)]
      : currentTrend.direction;
  } else {
    impact = (['bullish', 'bearish', 'neutral'] as const)[Math.floor(Math.random() * 3)];
  }

  // Select rumor from appropriate category
  const rumors = MARKET_RUMORS[impact];
  const content = rumors[Math.floor(Math.random() * rumors.length)];

  // Select source with weighted probability
  const sourceRoll = Math.random();
  let cumulativeWeight = 0;
  let selectedSourceIndex = 0;
  const totalWeight = NEWS_SOURCES.reduce((sum, s) => sum + s.weight, 0);
  
  for (let i = 0; i < NEWS_SOURCES.length; i++) {
    cumulativeWeight += NEWS_SOURCES[i].weight / totalWeight;
    if (sourceRoll < cumulativeWeight) {
      selectedSourceIndex = i;
      break;
    }
  }
  
  const selectedSource = NEWS_SOURCES[selectedSourceIndex];

  // Determine reliability based on source weight
  let reliability: MarketEvent['reliability'];
  if (selectedSource.weight > 0.85) {
    reliability = 'high';
  } else if (selectedSource.weight > 0.7) {
    reliability = 'medium';
  } else {
    reliability = 'low';
  }

  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    content,
    source: selectedSource.name,
    reliability,
    impact,
  };
};

/**
 * Calculate correlation score between event and price movement
 * Returns percentage (0-100)
 */
export const calculateCorrelation = (
  event: MarketEvent,
  priceMovement: number
): number => {
  const expectedDirection = event.impact === 'bullish' ? 1 : event.impact === 'bearish' ? -1 : 0;
  const actualDirection = priceMovement > 0 ? 1 : priceMovement < 0 ? -1 : 0;

  if (expectedDirection === 0) return 50; // Neutral events have 50% base correlation

  const directionMatch = expectedDirection === actualDirection;
  const magnitudeScore = Math.min(Math.abs(priceMovement) * 10, 50);

  if (directionMatch) {
    return 50 + magnitudeScore;
  } else {
    return 50 - magnitudeScore;
  }
};

/**
 * Reset trend state (for terminal reset)
 */
export const resetSimulation = (): void => {
  currentTrend = {
    direction: 'neutral',
    strength: 0.5,
    duration: 0,
  };
};
