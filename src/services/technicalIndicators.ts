/**
 * Technical Indicators Service
 * Calculate RSI, MACD, Bollinger Bands
 */

import { PricePoint } from '@/types';

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  sma20: number;
  sma50: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
}

export class TechnicalIndicatorsService {
  /**
   * Calculate RSI (Relative Strength Index)
   * RSI > 70 = Overbought
   * RSI < 30 = Oversold
   */
  static calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50; // Not enough data

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain/loss
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate RSI for remaining periods
    for (let i = period + 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? -change : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return Math.round(rsi * 100) / 100;
  }

  /**
   * Calculate SMA (Simple Moving Average)
   */
  static calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;

    const relevantPrices = prices.slice(-period);
    const sum = relevantPrices.reduce((acc, price) => acc + price, 0);
    return sum / period;
  }

  /**
   * Calculate EMA (Exponential Moving Average)
   */
  static calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return this.calculateSMA(prices, prices.length);

    const multiplier = 2 / (period + 1);
    let ema = this.calculateSMA(prices.slice(0, period), period);

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  static calculateMACD(prices: number[]): { value: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdValue = ema12 - ema26;

    // Calculate signal line (9-period EMA of MACD)
    const macdHistory = [macdValue]; // Simplified
    const signal = this.calculateEMA(macdHistory, 9);
    const histogram = macdValue - signal;

    return {
      value: Math.round(macdValue * 100) / 100,
      signal: Math.round(signal * 100) / 100,
      histogram: Math.round(histogram * 100) / 100,
    };
  }

  /**
   * Calculate Bollinger Bands
   */
  static calculateBollingerBands(
    prices: number[],
    period: number = 20,
    stdDev: number = 2
  ): { upper: number; middle: number; lower: number } {
    const sma = this.calculateSMA(prices, period);
    
    // Calculate standard deviation
    const relevantPrices = prices.slice(-period);
    const squaredDiffs = relevantPrices.map(price => Math.pow(price - sma, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / period;
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: Math.round((sma + (standardDeviation * stdDev)) * 100) / 100,
      middle: Math.round(sma * 100) / 100,
      lower: Math.round((sma - (standardDeviation * stdDev)) * 100) / 100,
    };
  }

  /**
   * Get all technical indicators
   */
  static getAllIndicators(pricePoints: PricePoint[]): TechnicalIndicators {
    const prices = pricePoints.map(p => p.price);
    const currentPrice = prices[prices.length - 1] || 0;

    const rsi = this.calculateRSI(prices);
    const macd = this.calculateMACD(prices);
    const bollingerBands = this.calculateBollingerBands(prices);
    const sma20 = this.calculateSMA(prices, 20);
    const sma50 = this.calculateSMA(prices, 50);

    // Generate recommendation
    let recommendation: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    
    if (rsi < 30 && currentPrice < bollingerBands.lower && macd.histogram > 0) {
      recommendation = 'BUY';
    } else if (rsi > 70 && currentPrice > bollingerBands.upper && macd.histogram < 0) {
      recommendation = 'SELL';
    }

    return {
      rsi,
      macd,
      bollingerBands,
      sma20: Math.round(sma20 * 100) / 100,
      sma50: Math.round(sma50 * 100) / 100,
      recommendation,
    };
  }

  /**
   * Get recommendation explanation
   */
  static getRecommendationExplanation(indicators: TechnicalIndicators): string {
    const { rsi, macd, bollingerBands, recommendation } = indicators;

    let explanation = `📊 **Technical Analysis**\n\n`;
    explanation += `**Recommendation: ${recommendation}**\n\n`;
    explanation += `• RSI: ${rsi.toFixed(2)} ${rsi > 70 ? '(Overbought)' : rsi < 30 ? '(Oversold)' : '(Neutral)'}\n`;
    explanation += `• MACD: ${macd.histogram > 0 ? '🟢 Bullish' : '🔴 Bearish'} (${macd.histogram.toFixed(2)})\n`;
    explanation += `• Bollinger Bands: Upper $${bollingerBands.upper} | Lower $${bollingerBands.lower}\n`;

    if (recommendation === 'BUY') {
      explanation += `\n✅ Oversold conditions suggest potential buying opportunity`;
    } else if (recommendation === 'SELL') {
      explanation += `\n⚠️ Overbought conditions suggest potential selling opportunity`;
    } else {
      explanation += `\n➡️ Neutral market conditions, wait for clearer signals`;
    }

    return explanation;
  }
}

export default TechnicalIndicatorsService;
