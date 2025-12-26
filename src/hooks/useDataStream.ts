import { useEffect, useRef } from 'react';
import { useMarket } from '@/context/MarketContext';
import { MarketEvent, PricePoint } from '@/types';

const NEWS_SOURCES = ['Reuters', 'Bloomberg', 'FT', 'WSJ', 'CNBC', 'ZeroHedge'];
const RELIABILITY_LEVELS: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
const IMPACTS: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];

const MOCK_RUMORS = [
  'Fed officials hint at potential rate pause in upcoming FOMC meeting',
  'Chinese central bank increases gold reserves for 18th consecutive month',
  'Geopolitical tensions escalate in Middle East, safe-haven demand rising',
  'Major hedge fund reportedly increasing gold allocation to 15%',
  'Dollar weakness expected as inflation data comes in softer than forecast',
  'Central banks worldwide accelerating gold purchases amid currency concerns',
  'Technical breakout imminent as gold tests key resistance at $2,700',
  'ETF inflows surge to highest level since 2020 pandemic peak',
  'Mining production disruptions reported in South Africa',
  'Institutional investors rotating from crypto to precious metals',
  'Swiss refiners report unprecedented demand from Asian buyers',
  'Options market shows significant call buying for year-end expiry',
  'Currency strategist warns of dollar devaluation risk',
  'Gold-to-S&P ratio signals potential equity market correction',
  'Physical gold premiums spike in Asian markets overnight',
];

const generateRandomEvent = (): MarketEvent => {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    content: MOCK_RUMORS[Math.floor(Math.random() * MOCK_RUMORS.length)],
    source: NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)],
    reliability: RELIABILITY_LEVELS[Math.floor(Math.random() * RELIABILITY_LEVELS.length)],
    impact: IMPACTS[Math.floor(Math.random() * IMPACTS.length)],
  };
};

export const useDataStream = () => {
  const { addEvent, addPricePoint, events, calculateAlphaSignal } = useMarket();
  const priceRef = useRef(2650 + Math.random() * 50);
  const lastEventRef = useRef<MarketEvent | null>(null);

  useEffect(() => {
    // Initial price points
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(now - i * 2000);
      const price = priceRef.current + (Math.random() - 0.5) * 5;
      priceRef.current = price;
      addPricePoint({
        timestamp,
        price,
        volume: Math.floor(Math.random() * 1000) + 500,
      });
    }

    // Price stream interval (every 2 seconds)
    const priceInterval = setInterval(() => {
      const momentum = lastEventRef.current
        ? lastEventRef.current.impact === 'bullish'
          ? 0.6
          : lastEventRef.current.impact === 'bearish'
          ? -0.6
          : 0
        : 0;

      const change = (Math.random() - 0.5 + momentum) * 3;
      priceRef.current = Math.max(2500, Math.min(2800, priceRef.current + change));

      const newPricePoint: PricePoint = {
        timestamp: new Date(),
        price: priceRef.current,
        volume: Math.floor(Math.random() * 1000) + 500,
        eventId: lastEventRef.current?.id,
      };

      addPricePoint(newPricePoint);

      // Calculate alpha signal if there was a recent event
      if (lastEventRef.current) {
        const timeSinceEvent =
          new Date().getTime() - lastEventRef.current.timestamp.getTime();
        if (timeSinceEvent < 10000 && timeSinceEvent > 2000) {
          calculateAlphaSignal(lastEventRef.current, newPricePoint);
          lastEventRef.current = null;
        }
      }
    }, 2000);

    // News stream interval (every 5-15 seconds)
    const scheduleNextEvent = () => {
      const delay = 5000 + Math.random() * 10000;
      return setTimeout(() => {
        const event = generateRandomEvent();
        addEvent(event);
        lastEventRef.current = event;
        eventTimeoutId = scheduleNextEvent();
      }, delay);
    };

    let eventTimeoutId = scheduleNextEvent();

    // Initial events
    setTimeout(() => {
      const initialEvent = generateRandomEvent();
      addEvent(initialEvent);
      lastEventRef.current = initialEvent;
    }, 1000);

    return () => {
      clearInterval(priceInterval);
      clearTimeout(eventTimeoutId);
    };
  }, [addEvent, addPricePoint, calculateAlphaSignal]);
};
