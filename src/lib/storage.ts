/**
 * Storage Engine for SentimentNexus
 * Handles localStorage persistence with type safety and error handling
 * SSR-safe with runtime checks for browser environment
 */

import { WhatsAppConfig, AlphaSignal } from '@/types';
import { STORAGE_KEYS, DATA_LIMITS } from '@/config/constants';

/**
 * Check if we're running in a browser environment
 */
const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

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
    if (!isBrowser()) {
      return {
        apiKey: '',
        webhookUrl: '',
        isEnabled: false,
      };
    }
    
    const stored = localStorage.getItem(STORAGE_KEYS.WHATSAPP_CONFIG);
    return safeJsonParse<WhatsAppConfig>(stored, {
      apiKey: '',
      webhookUrl: '',
      isEnabled: false,
    });
  },

  set: (config: WhatsAppConfig): void => {
    if (!isBrowser()) {
      console.warn('[Storage] localStorage not available');
      return;
    }
    
    try {
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_CONFIG, JSON.stringify(config));
    } catch (error) {
      console.error('[Storage] Failed to save WhatsApp config:', error);
    }
  },

  clear: (): void => {
    if (!isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.WHATSAPP_CONFIG);
  },
};

/**
 * Alpha Signals History Persistence
 * Stores signals with date serialization handling
 */
export const alphaSignalsStorage = {
  get: (): AlphaSignal[] => {
    if (!isBrowser()) return [];
    
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
    if (!isBrowser()) return;
    
    try {
      // Limit stored signals to prevent storage bloat
      const limitedSignals = signals.slice(0, DATA_LIMITS.MAX_STORED_SIGNALS);
      localStorage.setItem(STORAGE_KEYS.ALPHA_SIGNALS, JSON.stringify(limitedSignals));
    } catch (error) {
      console.error('[Storage] Failed to save alpha signals:', error);
    }
  },

  clear: (): void => {
    if (!isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.ALPHA_SIGNALS);
  },
};

/**
 * Terminal Reset - Clears all stored data
 * Returns true if successful, false otherwise
 */
export const resetTerminal = (): boolean => {
  if (!isBrowser()) {
    console.warn('[Storage] Cannot reset terminal - localStorage not available');
    return false;
  }
  
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
