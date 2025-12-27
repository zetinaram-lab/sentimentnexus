/**
 * Market Context Provider
 * Global state management for SentimentNexus with localStorage persistence
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { MarketEvent, PricePoint, AlphaSignal, WhatsAppConfig } from '@/types';
import {
  whatsAppStorage,
  alphaSignalsStorage,
  resetTerminal as resetStoredData,
} from '@/lib/storage';
import { resetSimulation } from '@/lib/marketSimulation';
import { useToast } from '@/hooks/use-toast';
import { DATA_LIMITS, WHATSAPP_CONFIG, APP_MODE } from '@/config/constants';

interface MarketContextType {
  // Data State
  events: MarketEvent[];
  priceData: PricePoint[];
  alphaSignals: AlphaSignal[];
  selectedEventId: string | null;
  whatsAppConfig: WhatsAppConfig;
  isTerminalActive: boolean;

  // Event Actions
  addEvent: (event: MarketEvent) => void;
  addPricePoint: (point: PricePoint) => void;
  selectEvent: (eventId: string | null) => void;

  // Config Actions
  updateWhatsAppConfig: (config: Partial<WhatsAppConfig>) => void;
  saveWhatsAppConfig: () => void;

  // Signal Actions
  addAlphaSignal: (signal: AlphaSignal) => void;

  // Terminal Actions
  resetTerminal: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  // Initialize state from localStorage
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [priceData, setPriceData] = useState<PricePoint[]>(() => {
    // Initialize with historical data (last 2 hours, 1 point per minute = 120 points)
    const now = new Date();
    const basePrice = 4560; // Starting price
    const points: PricePoint[] = [];
    
    for (let i = 120; i > 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 1000); // 1 minute intervals
      // Add small random variation (±0.5%) to simulate realistic price movement
      const variation = (Math.random() - 0.5) * 2 * (basePrice * 0.005);
      const price = basePrice + variation;
      
      points.push({
        timestamp,
        price: Math.round(price * 100) / 100, // Round to 2 decimals
        volume: Math.floor(Math.random() * 1000) + 500,
      });
    }
    
    return points;
  });
  const [alphaSignals, setAlphaSignals] = useState<AlphaSignal[]>(() => {
    return alphaSignalsStorage.get();
  });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(() => {
    return whatsAppStorage.get();
  });

  // Derived state: terminal is active if in dev mode OR API key is configured
  const isTerminalActive = APP_MODE.DEV_MODE || 
    (APP_MODE.REQUIRE_API_KEY && whatsAppConfig.apiKey.length >= WHATSAPP_CONFIG.MIN_API_KEY_LENGTH);

  // Persist alpha signals when they change
  useEffect(() => {
    if (alphaSignals.length > 0) {
      alphaSignalsStorage.set(alphaSignals);
    }
  }, [alphaSignals]);

  // Add new market event
  const addEvent = useCallback((event: MarketEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, DATA_LIMITS.MAX_EVENTS));
  }, []);

  // Add new price point
  const addPricePoint = useCallback((point: PricePoint) => {
    setPriceData((prev) => [...prev, point].slice(-DATA_LIMITS.MAX_PRICE_POINTS));
  }, []);

  // Select/deselect event for chart highlighting
  const selectEvent = useCallback((eventId: string | null) => {
    setSelectedEventId(eventId);
  }, []);

  // Update WhatsApp config (in memory only)
  const updateWhatsAppConfig = useCallback((config: Partial<WhatsAppConfig>) => {
    setWhatsAppConfig((prev) => ({ ...prev, ...config }));
  }, []);

  // Save WhatsApp config to localStorage
  const saveWhatsAppConfig = useCallback(() => {
    whatsAppStorage.set(whatsAppConfig);
    toast({
      title: 'Configuration Saved',
      description: 'Your settings have been persisted to local storage.',
    });
  }, [whatsAppConfig, toast]);

  // Add alpha signal with high-correlation detection
  const addAlphaSignal = useCallback(
    (signal: AlphaSignal) => {
      setAlphaSignals((prev) => {
        const updated = [signal, ...prev].slice(0, 100);
        return updated;
      });

      // Toast for high correlation signals
      if (signal.correlationScore && signal.correlationScore > 80) {
        toast({
          title: '🎯 High Correlation Detected',
          description: `${signal.correlationScore.toFixed(0)}% correlation with ${signal.lagSeconds.toFixed(1)}s alpha lag`,
        });
      }
    },
    [toast]
  );

  // Reset entire terminal
  const resetTerminal = useCallback(() => {
    const success = resetStoredData();
    if (success) {
      setEvents([]);
      setPriceData([]);
      setAlphaSignals([]);
      setSelectedEventId(null);
      setWhatsAppConfig({
        apiKey: '',
        webhookUrl: '',
        isEnabled: false,
      });
      resetSimulation();

      toast({
        title: 'Terminal Reset',
        description: 'All data and configurations have been cleared.',
      });
    } else {
      toast({
        title: 'Reset Failed',
        description: 'Unable to clear stored data. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return (
    <MarketContext.Provider
      value={{
        events,
        priceData,
        alphaSignals,
        selectedEventId,
        whatsAppConfig,
        isTerminalActive,
        addEvent,
        addPricePoint,
        selectEvent,
        updateWhatsAppConfig,
        saveWhatsAppConfig,
        addAlphaSignal,
        resetTerminal,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

/**
 * Hook to access Market Context
 * Must be used within MarketProvider
 */
export const useMarket = (): MarketContextType => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
