/**
 * useAlphaTracker Hook
 * Detects correlations between news events and price movements
 * Calculates the "alpha" (time lag) between event and market reaction
 */

import { useCallback } from 'react';
import { MarketEvent, PricePoint, AlphaSignal } from '@/types';

interface UseAlphaTrackerReturn {
  detectAlphaSignal: (
    event: MarketEvent,
    priceData: PricePoint[],
    currentPrice: number
  ) => AlphaSignal | null;
  calculateCorrelationScore: (
    event: MarketEvent,
    priceChange: number,
    timeWindow: number
  ) => number;
}

/**
 * Hook for detecting and analyzing alpha signals
 */
export const useAlphaTracker = (): UseAlphaTrackerReturn => {
  /**
   * Calculate correlation score between event and price movement
   * Returns a score from 0-100
   */
  const calculateCorrelationScore = useCallback(
    (event: MarketEvent, priceChange: number, timeWindow: number): number => {
      let score = 50; // Base score

      // Factor 1: Event reliability (30 points max)
      if (event.reliability === 'high') {
        score += 30;
      } else if (event.reliability === 'medium') {
        score += 15;
      }

      // Factor 2: Direction match (20 points max)
      const priceDirection = priceChange > 0 ? 'bullish' : 'bearish';
      if (
        (event.impact === 'bullish' && priceDirection === 'bullish') ||
        (event.impact === 'bearish' && priceDirection === 'bearish')
      ) {
        score += 20;
      } else if (event.impact === 'neutral') {
        score += 5;
      }

      // Factor 3: Time window bonus (faster = higher score, max 20 points)
      const timeBonus = Math.max(0, 20 - timeWindow / 2);
      score += timeBonus;

      // Cap at 100
      return Math.min(100, Math.max(0, score));
    },
    []
  );

  /**
   * Detect if an event correlates with a price movement
   * Returns AlphaSignal if correlation detected, null otherwise
   */
  const detectAlphaSignal = useCallback(
    (
      event: MarketEvent,
      priceData: PricePoint[],
      currentPrice: number
    ): AlphaSignal | null => {
      if (priceData.length < 2) return null;

      // Get price before event
      const eventTime = event.timestamp.getTime();
      const priceBeforeEvent = priceData
        .filter((p) => p.timestamp.getTime() <= eventTime)
        .slice(-1)[0];

      if (!priceBeforeEvent) return null;

      // Calculate price change
      const priceChange = currentPrice - priceBeforeEvent.price;
      const priceChangePercent = (priceChange / priceBeforeEvent.price) * 100;

      // Only trigger if significant movement (> 0.1%)
      if (Math.abs(priceChangePercent) < 0.1) return null;

      // Calculate time lag
      const now = new Date();
      const lagMs = now.getTime() - eventTime;
      const lagSeconds = Math.round(lagMs / 1000);

      // Only detect signals within 60 seconds
      if (lagSeconds > 60) return null;

      const correlationScore = calculateCorrelationScore(
        event,
        priceChange,
        lagSeconds
      );

      // Only return high-confidence signals (score > 60)
      if (correlationScore < 60) return null;

      return {
        eventId: event.id,
        eventTimestamp: event.timestamp,
        priceChangeTimestamp: now,
        lagSeconds,
        priceChange,
        direction: priceChange > 0 ? 'up' : 'down',
        correlationScore,
      };
    },
    [calculateCorrelationScore]
  );

  return {
    detectAlphaSignal,
    calculateCorrelationScore,
  };
};
