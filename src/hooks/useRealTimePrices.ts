/**
 * useRealTimePrices Hook
 * Fetches real gold prices from Finnhub API
 */

import { useEffect, useRef, useCallback } from 'react';
import { MarketDataService } from '@/services/marketDataService';
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
      const data = await MarketDataService.getCurrentPrice();
      
      // Only add if price actually changed
      if (data.price !== lastPriceRef.current) {
        lastPriceRef.current = data.price;
        
        addPricePoint({
          timestamp: new Date(data.timestamp),
          price: data.price,
          volume: Math.floor(Math.random() * 1000) + 500, // Mock volume for now
        });

        console.log('[useRealTimePrices] Updated price:', {
          price: data.price,
          high: data.high24h,
          low: data.low24h,
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
