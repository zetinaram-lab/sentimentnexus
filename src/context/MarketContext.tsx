import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MarketEvent, PricePoint, AlphaSignal, WhatsAppConfig } from '@/types';

interface MarketContextType {
  events: MarketEvent[];
  priceData: PricePoint[];
  alphaSignals: AlphaSignal[];
  selectedEventId: string | null;
  whatsAppConfig: WhatsAppConfig;
  addEvent: (event: MarketEvent) => void;
  addPricePoint: (point: PricePoint) => void;
  selectEvent: (eventId: string | null) => void;
  updateWhatsAppConfig: (config: Partial<WhatsAppConfig>) => void;
  calculateAlphaSignal: (event: MarketEvent, priceChange: PricePoint) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [alphaSignals, setAlphaSignals] = useState<AlphaSignal[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>({
    apiKey: '',
    webhookUrl: '',
    isEnabled: false,
  });

  const addEvent = useCallback((event: MarketEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 50));
  }, []);

  const addPricePoint = useCallback((point: PricePoint) => {
    setPriceData((prev) => [...prev, point].slice(-100));
  }, []);

  const selectEvent = useCallback((eventId: string | null) => {
    setSelectedEventId(eventId);
  }, []);

  const updateWhatsAppConfig = useCallback((config: Partial<WhatsAppConfig>) => {
    setWhatsAppConfig((prev) => ({ ...prev, ...config }));
  }, []);

  const calculateAlphaSignal = useCallback((event: MarketEvent, priceChange: PricePoint) => {
    const lagSeconds = (priceChange.timestamp.getTime() - event.timestamp.getTime()) / 1000;
    const signal: AlphaSignal = {
      eventId: event.id,
      eventTimestamp: event.timestamp,
      priceChangeTimestamp: priceChange.timestamp,
      lagSeconds,
      priceChange: priceChange.price,
      direction: priceChange.price > 0 ? 'up' : 'down',
    };
    setAlphaSignals((prev) => [signal, ...prev].slice(0, 20));
  }, []);

  return (
    <MarketContext.Provider
      value={{
        events,
        priceData,
        alphaSignals,
        selectedEventId,
        whatsAppConfig,
        addEvent,
        addPricePoint,
        selectEvent,
        updateWhatsAppConfig,
        calculateAlphaSignal,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
