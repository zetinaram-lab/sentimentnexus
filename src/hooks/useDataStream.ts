/**
 * Data Stream Hook
 * Manages real-time market simulation with event-driven price reactions
 */

import { useEffect, useRef, useCallback } from 'react';
import { useMarket } from '@/context/MarketContext';
import { MarketEvent, PricePoint } from '@/types';
import {
  generatePriceMovement,
  generateMarketEvent,
  calculateCorrelation,
} from '@/lib/marketSimulation';

// Timing constants (in milliseconds)
const PRICE_UPDATE_INTERVAL = 2000;
const EVENT_MIN_DELAY = 5000;
const EVENT_MAX_DELAY = 15000;
const EVENT_REACTION_DELAY = 2500; // 2-3 seconds after high-reliability event

export const useDataStream = (): void => {
  const { addEvent, addPricePoint, addAlphaSignal, isTerminalActive } = useMarket();

  // Refs to track mutable state without causing re-renders
  const priceRef = useRef(2650 + Math.random() * 50);
  const pendingEventRef = useRef<MarketEvent | null>(null);
  const eventReactionTimeRef = useRef<number | null>(null);
  const lastEventRef = useRef<MarketEvent | null>(null);

  /**
   * Process price update with potential event reaction
   */
  const processPriceUpdate = useCallback(() => {
    const now = Date.now();

    // Check if we should react to a pending high-reliability event
    let eventToProcess: MarketEvent | null = null;
    if (
      pendingEventRef.current &&
      eventReactionTimeRef.current &&
      now >= eventReactionTimeRef.current
    ) {
      eventToProcess = pendingEventRef.current;
      pendingEventRef.current = null;
      eventReactionTimeRef.current = null;
    }

    // Generate price movement
    const { price: newPrice, momentum } = generatePriceMovement(
      priceRef.current,
      eventToProcess
    );
    priceRef.current = newPrice;

    // Create price point
    const newPricePoint: PricePoint = {
      timestamp: new Date(),
      price: newPrice,
      volume: Math.floor(Math.random() * 1000) + 500,
      eventId: eventToProcess?.id,
    };

    addPricePoint(newPricePoint);

    // Calculate alpha signal if we just reacted to an event
    if (eventToProcess) {
      const correlationScore = calculateCorrelation(eventToProcess, momentum);

      addAlphaSignal({
        eventId: eventToProcess.id,
        eventTimestamp: eventToProcess.timestamp,
        priceChangeTimestamp: new Date(),
        lagSeconds: (now - eventToProcess.timestamp.getTime()) / 1000,
        priceChange: momentum,
        direction: momentum >= 0 ? 'up' : 'down',
        correlationScore,
      });

      lastEventRef.current = null;
    }
  }, [addPricePoint, addAlphaSignal]);

  /**
   * Generate and dispatch a new market event
   */
  const dispatchEvent = useCallback(() => {
    const event = generateMarketEvent();
    addEvent(event);

    // Queue high-reliability events for price reaction
    if (event.reliability === 'high' || event.reliability === 'medium') {
      pendingEventRef.current = event;
      // Reaction delay: 2-3 seconds for high, 3-4 seconds for medium
      const delay =
        event.reliability === 'high'
          ? EVENT_REACTION_DELAY + Math.random() * 500
          : EVENT_REACTION_DELAY + 1000 + Math.random() * 1000;
      eventReactionTimeRef.current = Date.now() + delay;
      lastEventRef.current = event;
    }
  }, [addEvent]);

  useEffect(() => {
    // Don't run simulation if terminal is inactive
    if (!isTerminalActive) return;

    // Initialize with historical price points
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(now - i * PRICE_UPDATE_INTERVAL);
      const { price } = generatePriceMovement(priceRef.current, null);
      priceRef.current = price;

      addPricePoint({
        timestamp,
        price,
        volume: Math.floor(Math.random() * 1000) + 500,
      });
    }

    // Start price update interval
    const priceInterval = setInterval(processPriceUpdate, PRICE_UPDATE_INTERVAL);

    // Schedule event generation
    const scheduleNextEvent = (): NodeJS.Timeout => {
      const delay = EVENT_MIN_DELAY + Math.random() * (EVENT_MAX_DELAY - EVENT_MIN_DELAY);
      return setTimeout(() => {
        dispatchEvent();
        eventTimeoutId = scheduleNextEvent();
      }, delay);
    };

    let eventTimeoutId = scheduleNextEvent();

    // Initial event after 1 second
    const initialEventTimeout = setTimeout(() => {
      dispatchEvent();
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(priceInterval);
      clearTimeout(eventTimeoutId);
      clearTimeout(initialEventTimeout);
    };
  }, [isTerminalActive, processPriceUpdate, dispatchEvent, addPricePoint]);
};
