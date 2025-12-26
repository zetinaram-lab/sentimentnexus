/**
 * Storage Engine for SentimentNexus
 * Handles localStorage persistence with type safety and error handling
 */

import { WhatsAppConfig, AlphaSignal } from '@/types';

const STORAGE_KEYS = {
  WHATSAPP_CONFIG: 'sentinelnexus_whatsapp_config',
  ALPHA_SIGNALS: 'sentinelnexus_alpha_signals',
  TERMINAL_SESSION: 'sentinelnexus_session',
} as const;

/**
 * Safely parse JSON from localStorage with fallback
 */
const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    console.warn('[Storage] Failed to parse stored value, using fallback');
    return fallback;
  }
};

/**
 * WhatsApp Configuration Persistence
 */
export const whatsAppStorage = {
  get: (): WhatsAppConfig => {
    const stored = localStorage.getItem(STORAGE_KEYS.WHATSAPP_CONFIG);
    return safeJsonParse<WhatsAppConfig>(stored, {
      apiKey: '',
      webhookUrl: '',
      isEnabled: false,
    });
  },

  set: (config: WhatsAppConfig): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(config));
    } catch (error) {
      console.error('[Storage] Failed to save WhatsApp config:', error);
    }
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.WHATSAPP_CONFIG);
  },
};

/**
 * Alpha Signals History Persistence
 * Stores signals with date serialization handling
 */
export const alphaSignalsStorage = {
  get: (): AlphaSignal[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ALPHA_SIGNALS);
    const signals = safeJsonParse<AlphaSignal[]>(stored, []);
    
    // Rehydrate Date objects from ISO strings
    return signals.map((signal) => ({
      ...signal,
      eventTimestamp: new Date(signal.eventTimestamp),
      priceChangeTimestamp: new Date(signal.priceChangeTimestamp),
    }));
  },

  set: (signals: AlphaSignal[]): void => {
    try {
      // Limit stored signals to prevent storage bloat
      const limitedSignals = signals.slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.ALPHA_SIGNALS, JSON.stringify(limitedSignals));
    } catch (error) {
      console.error('[Storage] Failed to save alpha signals:', error);
    }
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ALPHA_SIGNALS);
  },
};

/**
 * Terminal Reset - Clears all stored data
 * Returns true if successful, false otherwise
 */
export const resetTerminal = (): boolean => {
  try {
    whatsAppStorage.clear();
    alphaSignalsStorage.clear();
    localStorage.removeItem(STORAGE_KEYS.TERMINAL_SESSION);
    console.info('[Storage] Terminal reset complete');
    return true;
  } catch (error) {
    console.error('[Storage] Terminal reset failed:', error);
    return false;
  }
};

/**
 * Check if terminal has been configured (has API key)
 */
export const isTerminalConfigured = (): boolean => {
  const config = whatsAppStorage.get();
  return config.apiKey.length >= 20;
};
