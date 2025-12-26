/**
 * Alert Service
 * Intelligent price alerts and notifications
 */

export interface PriceAlert {
  id: string;
  type: 'price_target' | 'percentage_change' | 'trend_change';
  condition: 'above' | 'below' | 'change';
  value: number;
  currentPrice: number;
  triggered: boolean;
  message: string;
  timestamp: Date;
}

export interface AlertConfig {
  priceTargets: number[];
  percentageThreshold: number; // e.g., 2 for 2%
  enableTrendAlerts: boolean;
  notificationEnabled: boolean;
}

export class AlertService {
  private static lastPrice: number = 0;
  private static basePrice: number = 0; // Price at start of session
  private static lastTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  private static triggeredAlerts: Set<string> = new Set();

  /**
   * Initialize alert service with base price
   */
  static initialize(currentPrice: number) {
    this.basePrice = currentPrice;
    this.lastPrice = currentPrice;
    console.log('[AlertService] Initialized with base price:', currentPrice);
  }

  /**
   * Check all alert conditions
   */
  static async checkAlerts(
    currentPrice: number,
    config: AlertConfig
  ): Promise<PriceAlert[]> {
    const alerts: PriceAlert[] = [];

    // Initialize if needed
    if (this.basePrice === 0) {
      this.initialize(currentPrice);
    }

    // Check percentage changes
    if (config.percentageThreshold > 0) {
      const percentChange = ((currentPrice - this.basePrice) / this.basePrice) * 100;
      
      if (Math.abs(percentChange) >= config.percentageThreshold) {
        const alertId = `percent_${percentChange > 0 ? 'up' : 'down'}_${Math.abs(percentChange).toFixed(2)}`;
        
        if (!this.triggeredAlerts.has(alertId)) {
          alerts.push({
            id: alertId,
            type: 'percentage_change',
            condition: 'change',
            value: percentChange,
            currentPrice,
            triggered: true,
            message: `🚨 Gold ${percentChange > 0 ? '📈 UP' : '📉 DOWN'} ${Math.abs(percentChange).toFixed(2)}%!\n\nFrom: $${this.basePrice.toFixed(2)}\nTo: $${currentPrice.toFixed(2)}`,
            timestamp: new Date(),
          });
          this.triggeredAlerts.add(alertId);
          
          // Reset base price after alert
          this.basePrice = currentPrice;
        }
      }
    }

    // Check price targets
    for (const target of config.priceTargets) {
      const alertId = `target_${target}`;
      
      if (!this.triggeredAlerts.has(alertId)) {
        const crossedUp = this.lastPrice < target && currentPrice >= target;
        const crossedDown = this.lastPrice > target && currentPrice <= target;
        
        if (crossedUp || crossedDown) {
          alerts.push({
            id: alertId,
            type: 'price_target',
            condition: crossedUp ? 'above' : 'below',
            value: target,
            currentPrice,
            triggered: true,
            message: `🎯 Price Target ${crossedUp ? 'Reached' : 'Broken'}!\n\nTarget: $${target}\nCurrent: $${currentPrice.toFixed(2)}\nDirection: ${crossedUp ? '⬆️ Above' : '⬇️ Below'}`,
            timestamp: new Date(),
          });
          this.triggeredAlerts.add(alertId);
        }
      }
    }

    // Check trend changes
    if (config.enableTrendAlerts) {
      const trend = this.detectTrend(currentPrice);
      
      if (trend !== this.lastTrend && this.lastTrend !== 'neutral') {
        const alertId = `trend_${trend}_${Date.now()}`;
        
        alerts.push({
          id: alertId,
          type: 'trend_change',
          condition: 'change',
          value: currentPrice,
          currentPrice,
          triggered: true,
          message: `📊 Trend Change Detected!\n\nFrom: ${this.getTrendEmoji(this.lastTrend)} ${this.lastTrend.toUpperCase()}\nTo: ${this.getTrendEmoji(trend)} ${trend.toUpperCase()}\nPrice: $${currentPrice.toFixed(2)}`,
          timestamp: new Date(),
        });
      }
      
      this.lastTrend = trend;
    }

    this.lastPrice = currentPrice;
    return alerts;
  }

  /**
   * Detect price trend using simple moving average logic
   */
  private static detectTrend(currentPrice: number): 'bullish' | 'bearish' | 'neutral' {
    const change = currentPrice - this.lastPrice;
    const changePercent = (change / this.lastPrice) * 100;

    if (changePercent > 0.1) return 'bullish';
    if (changePercent < -0.1) return 'bearish';
    return 'neutral';
  }

  /**
   * Get emoji for trend
   */
  private static getTrendEmoji(trend: 'bullish' | 'bearish' | 'neutral'): string {
    switch (trend) {
      case 'bullish': return '🚀';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  }

  /**
   * Send alert via Telegram
   */
  static async sendTelegramAlert(alert: PriceAlert): Promise<boolean> {
    try {
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: alert.message }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('[AlertService] Failed to send Telegram alert:', error);
      return false;
    }
  }

  /**
   * Reset all triggered alerts
   */
  static resetAlerts() {
    this.triggeredAlerts.clear();
    console.log('[AlertService] Alerts reset');
  }

  /**
   * Get alert statistics
   */
  static getStats() {
    return {
      basePrice: this.basePrice,
      lastPrice: this.lastPrice,
      currentTrend: this.lastTrend,
      totalTriggered: this.triggeredAlerts.size,
    };
  }
}

export default AlertService;
