/**
 * Real-Time Gold Price Service
 * Multiple FREE sources with smart fallbacks
 */

import { PricePoint } from '@/types';

interface GoldPriceData {
  price: number;
  timestamp: number;
  source: string;
}

/**
 * Real-Time Gold Price Service
 * Uses multiple free APIs with automatic fallback
 */
export class RealGoldPriceService {
  private static lastPrice: number = 4560; // Fallback price (realistic)
  private static lastUpdate: number = 0;
  private static readonly CACHE_DURATION = 5000; // 5 seconds cache (más frecuente)

  /**
   * Get current gold price from multiple sources
   * Falls back to next source if one fails
   */
  static async getCurrentPrice(): Promise<GoldPriceData> {
    // Return cached price if recent
    const now = Date.now();
    if (now - this.lastUpdate < this.CACHE_DURATION) {
      return {
        price: this.lastPrice,
        timestamp: this.lastUpdate,
        source: 'cache'
      };
    }

    // Try multiple sources in order (Binance first - most reliable)
    const sources = [
      () => this.getFromBinance(),
      () => this.getFromMetalsAPI(),
      () => this.getFromCoinbase(),
    ];

    for (const source of sources) {
      try {
        const data = await source();
        console.log(`✅ Gold price from ${data.source}: $${data.price}`);
        this.lastPrice = data.price;
        this.lastUpdate = data.timestamp;
        return data;
      } catch (error) {
        console.warn(`❌ Source failed, trying next...`, error);
        continue;
      }
    }

    // All sources failed, return cached price
    return {
      price: this.lastPrice,
      timestamp: this.lastUpdate,
      source: 'fallback'
    };
  }

  /**
   * Metals-API.com (Free tier: 50 requests/month)
   * XAU/USD = Gold spot price
   */
  private static async getFromMetalsAPI(): Promise<GoldPriceData> {
    const apiKey = import.meta.env.VITE_METALS_API_KEY;
    if (!apiKey) throw new Error('No Metals-API key');

    const response = await fetch(
      `https://metals-api.com/api/latest?access_key=${apiKey}&base=XAU&symbols=USD`
    );

    if (!response.ok) throw new Error('Metals-API failed');

    const data = await response.json();
    const price = 1 / data.rates.USD; // Convert XAU/USD to USD/XAU (price per oz)

    return {
      price: Math.round(price * 100) / 100,
      timestamp: Date.now(),
      source: 'metals-api'
    };
  }

  /**
   * Coinbase spot price (Indirect: Uses BTC as proxy)
   * Free, unlimited, no API key needed
   */
  private static async getFromCoinbase(): Promise<GoldPriceData> {
    const response = await fetch(
      'https://api.coinbase.com/v2/prices/BTC-USD/spot'
    );

    if (!response.ok) throw new Error('Coinbase failed');

    const data = await response.json();
    const btcPrice = parseFloat(data.data.amount);
    
    // Rough conversion: BTC/Gold ratio is ~17:1 currently
    // This is an approximation - better to use real gold API
    const estimatedGoldPrice = btcPrice / 17;

    return {
      price: Math.round(estimatedGoldPrice * 100) / 100,
      timestamp: Date.now(),
      source: 'coinbase-estimate'
    };
  }

  /**
   * Binance API (Free, unlimited)
   * Uses PAXG (tokenized gold) as proxy
   * 1 PAXG = 1 troy ounce of gold
   */
  private static async getFromBinance(): Promise<GoldPriceData> {
    const response = await fetch(
      'https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT'
    );

    if (!response.ok) throw new Error('Binance failed');

    const data = await response.json();
    const price = parseFloat(data.price);

    return {
      price: Math.round(price * 100) / 100,
      timestamp: Date.now(),
      source: 'binance-paxg'
    };
  }

  /**
   * Get historical prices (mock for now, can implement later)
   */
  static async getHistoricalPrices(
    symbol: string,
    interval: string = '1h',
    limit: number = 100
  ): Promise<PricePoint[]> {
    // For now, return empty array
    // Can implement with Binance historical data later
    return [];
  }

  /**
   * Convert price data to PricePoint format
   */
  static toPricePoint(data: GoldPriceData): PricePoint {
    return {
      price: data.price,
      timestamp: new Date(data.timestamp),
      volume: 0, // Not available from these sources
    };
  }
}

// Export for use in hooks
export default RealGoldPriceService;
