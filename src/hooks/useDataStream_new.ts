/**
 * Data Stream Hook
 * Generates ONLY news events (market intelligence feed)
 * Prices are handled by useRealTimePrices hook
 */

import { useEffect, useRef, useCallback } from 'react';
import { useMarket } from '@/context/MarketContext';
import { MarketEvent } from '@/types';
import { generateMarketEvent } from '@/lib/marketSimulation';

// Event timing constants (in milliseconds)
const EVENT_MIN_DELAY = 5000;  // 5 seconds
const EVENT_MAX_DELAY = 15000; // 15 seconds

export const useDataStream = (): void => {
  const { addEvent, isTerminalActive } = useMarket();

  // Track last event to avoid duplicates
  const lastEventRef = useRef<MarketEvent | null>(null);

  /**
   * Generate and dispatch a news event
   */
  const dispatchEvent = useCallback(() => {
    const event = generateMarketEvent();
    addEvent(event);
    lastEventRef.current = event;

    console.log('[useDataStream] Event generated:', {
      type: event.type,
      description: event.description,
      timestamp: event.timestamp.toLocaleTimeString(),
    });
  }, [addEvent]);

  /**
   * Schedule next event with random delay
   */
  const scheduleNextEvent = useCallback((): number => {
    const delay = EVENT_MIN_DELAY + Math.random() * (EVENT_MAX_DELAY - EVENT_MIN_DELAY);
    return window.setTimeout(dispatchEvent, delay);
  }, [dispatchEvent]);

  useEffect(() => {
    if (!isTerminalActive) {
      console.log('[useDataStream] Terminal inactive, news events paused');
      return;
    }

    console.log('[useDataStream] News event stream started');

    // Generate initial event after a short delay
    const initialTimeout = setTimeout(dispatchEvent, 2000);

    // Schedule recurring events
    let nextEventTimeout = scheduleNextEvent();

    const eventInterval = setInterval(() => {
      clearTimeout(nextEventTimeout);
      nextEventTimeout = scheduleNextEvent();
    }, EVENT_MAX_DELAY);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(nextEventTimeout);
      clearInterval(eventInterval);
      console.log('[useDataStream] News event stream stopped');
    };
  }, [isTerminalActive, dispatchEvent, scheduleNextEvent]);
};
