/**
 * useAlerts Hook
 * Monitors price changes and triggers alerts
 */

import { useEffect, useState, useCallback } from 'react';
import { useMarket } from '@/context/MarketContext';
import AlertService, { AlertConfig, PriceAlert } from '@/services/alertService';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_CONFIG: AlertConfig = {
  priceTargets: [4500, 4600, 4700, 4800], // Key price levels
  percentageThreshold: 2, // Alert on 2% change
  enableTrendAlerts: true,
  notificationEnabled: true,
};

export const useAlerts = (config: Partial<AlertConfig> = {}) => {
  const { priceData } = useMarket();
  const { toast } = useToast();
  const [activeAlerts, setActiveAlerts] = useState<PriceAlert[]>([]);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    ...DEFAULT_CONFIG,
    ...config,
  });

  const checkAlerts = useCallback(async () => {
    if (priceData.length === 0) return;

    const currentPrice = priceData[priceData.length - 1].price;
    const alerts = await AlertService.checkAlerts(currentPrice, alertConfig);

    if (alerts.length > 0) {
      setActiveAlerts(prev => [...prev, ...alerts]);

      // Send notifications
      for (const alert of alerts) {
        // Show toast notification
        toast({
          title: getAlertTitle(alert),
          description: alert.message,
          variant: alert.type === 'percentage_change' ? 'destructive' : 'default',
        });

        // Send Telegram notification if enabled
        if (alertConfig.notificationEnabled) {
          await AlertService.sendTelegramAlert(alert);
        }
      }
    }
  }, [priceData, alertConfig, toast]);

  useEffect(() => {
    const interval = setInterval(checkAlerts, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [checkAlerts]);

  const updateConfig = useCallback((newConfig: Partial<AlertConfig>) => {
    setAlertConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetAlerts = useCallback(() => {
    AlertService.resetAlerts();
    setActiveAlerts([]);
  }, []);

  const stats = AlertService.getStats();

  return {
    activeAlerts,
    alertConfig,
    updateConfig,
    resetAlerts,
    stats,
  };
};

function getAlertTitle(alert: PriceAlert): string {
  switch (alert.type) {
    case 'price_target':
      return '🎯 Price Target Alert';
    case 'percentage_change':
      return '🚨 Price Movement Alert';
    case 'trend_change':
      return '📊 Trend Change Alert';
    default:
      return '🔔 Alert';
  }
}
