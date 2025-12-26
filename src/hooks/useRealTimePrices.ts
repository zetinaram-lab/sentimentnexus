/**
 * useRealTimePrices Hook
 * Fetches real gold prices from 100% FREE sources
 */

import { useEffect, useRef, useCallback } from 'react';
import RealGoldPriceService from '@/services/realGoldPriceService';
import { useMarket } from '@/context/MarketContext';
import { TIMING } from '@/config/constants';

interface UseRealTimePricesOptions {
  enabled?: boolean;
  interval?: number;
}

export const useRealTimePrices = (options: UseRealTimePricesOptions = {}) => {
  const { enabled = true, interval = TIMING.DATA_STREAM_INTERVAL } = options;
  const { addPricePoint } = useMarket();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPriceRef = useRef<number>(0);

  const fetchPrice = useCallback(async () => {
    try {
      const { price, source } = await RealGoldPriceService.getCurrentPrice();
      
      // Only add if price actually changed
      if (price !== lastPriceRef.current) {
        lastPriceRef.current = price;
        
        addPricePoint({
          timestamp: new Date(),
          price: price,
          volume: Math.floor(Math.random() * 1000) + 500, // Mock volume for now
        });

        console.log('[useRealTimePrices] Updated price:', {
          price: price,
          source: source,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (error) {
      console.error('[useRealTimePrices] Failed to fetch price:', error);
    }
  }, [addPricePoint]);

  useEffect(() => {
    if (!enabled) return;

    // Fetch immediately on mount
    fetchPrice();

    // Set up interval for regular updates
    intervalRef.current = setInterval(fetchPrice, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval, fetchPrice]);
};
