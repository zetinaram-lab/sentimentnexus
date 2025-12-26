/**
 * Free Gold Price Service
 * Uses completely free APIs - no credit card required
 */

import { PricePoint } from '@/types';

/**
 * Free API Options (100% Free Forever):
 * 1. Metals.dev - 50 requests/month FREE
 * 2. GoldAPI.io - 50 requests/month FREE  
 * 3. Public scraping fallback (unlimited)
 */

interface GoldPriceResponse {
  price: number;
  timestamp: number;
  currency: string;
}

/**
 * Option 1: Metals.dev API (50 requests/month FREE)
 * Register at: https://metals.dev
 */
export class MetalsDevService {
  private static readonly API_URL = 'https://api.metals.dev/v1/latest';
  private static readonly API_KEY = import.meta.env.VITE_METALS_DEV_KEY || '';

  static async getCurrentPrice(): Promise<number> {
    try {
      const response = await fetch(
        `${this.API_URL}?api_key=${this.API_KEY}&currency=USD&unit=oz`
      );
      
      if (!response.ok) throw new Error('Metals.dev API failed');
      
      const data = await response.json();
      return data.metals.gold; // Price in USD per ounce
    } catch (error) {
      console.error('[MetalsDevService] Error:', error);
      throw error;
    }
  }
}

/**
 * Option 2: GoldAPI.io (50 requests/month FREE)
 * Register at: https://www.goldapi.io/
 */
export class GoldAPIService {
  private static readonly API_URL = 'https://www.goldapi.io/api';
  private static readonly API_KEY = import.meta.env.VITE_GOLDAPI_KEY || '';

  static async getCurrentPrice(): Promise<number> {
    try {
      const response = await fetch(`${this.API_URL}/XAU/USD`, {
        headers: {
          'x-access-token': this.API_KEY,
        },
      });
      
      if (!response.ok) throw new Error('GoldAPI failed');
      
      const data = await response.json();
      return data.price; // Price in USD per ounce
    } catch (error) {
      console.error('[GoldAPIService] Error:', error);
      throw error;
    }
  }
}

/**
 * Option 3: Public Scraping (100% FREE, UNLIMITED)
 * Uses public financial sites
 */
export class FreeGoldPriceService {
  /**
   * Scrape from investing.com widget (public data)
   */
  static async getCurrentPriceFromInvesting(): Promise<number> {
    try {
      // Using a CORS proxy to fetch public data
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = 'https://www.investing.com/commodities/gold';
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      const html = await response.text();
      
      // Extract price from HTML (simple regex)
      const priceMatch = html.match(/data-test="instrument-price-last"[^>]*>([0-9,]+\.[0-9]+)/);
      
      if (priceMatch && priceMatch[1]) {
        return parseFloat(priceMatch[1].replace(',', ''));
      }
      
      throw new Error('Could not parse price');
    } catch (error) {
      console.error('[FreeGoldPriceService] Scraping failed:', error);
      throw error;
    }
  }

  /**
   * Alternative: Use Yahoo Finance (public API)
   */
  static async getCurrentPriceFromYahoo(): Promise<number> {
    try {
      // Yahoo Finance chart API (public, no key needed)
      const symbol = 'GC=F'; // Gold Futures
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const price = data.chart.result[0].meta.regularMarketPrice;
      return price;
    } catch (error) {
      console.error('[FreeGoldPriceService] Yahoo failed:', error);
      throw error;
    }
  }

  /**
   * Fallback chain: Try all methods until one works
   */
  static async getCurrentPrice(): Promise<number> {
    const methods = [
      this.getCurrentPriceFromYahoo,
      this.getCurrentPriceFromInvesting,
    ];

    for (const method of methods) {
      try {
        const price = await method.call(this);
        console.log('[FreeGoldPriceService] Got price:', price);
        return price;
      } catch (error) {
        console.warn('[FreeGoldPriceService] Method failed, trying next...');
        continue;
      }
    }

    throw new Error('All free price sources failed');
  }
}

/**
 * Main service with automatic fallback
 */
export class FreeMarketDataService {
  static async getCurrentPrice(): Promise<{ price: number; source: string }> {
    // Try paid APIs first if configured
    const metalsKey = import.meta.env.VITE_METALS_DEV_KEY;
    const goldApiKey = import.meta.env.VITE_GOLDAPI_KEY;

    if (metalsKey) {
      try {
        const price = await MetalsDevService.getCurrentPrice();
        return { price, source: 'Metals.dev' };
      } catch (error) {
        console.warn('[FreeMarketDataService] Metals.dev failed, trying alternatives...');
      }
    }

    if (goldApiKey) {
      try {
        const price = await GoldAPIService.getCurrentPrice();
        return { price, source: 'GoldAPI.io' };
      } catch (error) {
        console.warn('[FreeMarketDataService] GoldAPI failed, trying alternatives...');
      }
    }

    // Always fallback to free sources
    const price = await FreeGoldPriceService.getCurrentPrice();
    return { price, source: 'Free Source' };
  }
}

/**
 * Mock service for development
 */
export class MockGoldPriceService {
  private static basePrice = 2650;
  private static volatility = 0.001;

  static getCurrentPrice(): { price: number; source: string } {
    // Random walk with small volatility
    const change = (Math.random() - 0.5) * this.basePrice * this.volatility;
    this.basePrice += change;
    
    // Keep within realistic bounds
    this.basePrice = Math.max(2600, Math.min(2700, this.basePrice));
    
    return {
      price: parseFloat(this.basePrice.toFixed(2)),
      source: 'Mock Data',
    };
  }
}
