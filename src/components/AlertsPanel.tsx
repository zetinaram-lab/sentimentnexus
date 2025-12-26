/**
 * Alerts Configuration Panel
 * Configure price targets, percentage alerts, and trend notifications
 */

import React, { useState } from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Target, TrendingUp, Trash2, Plus } from 'lucide-react';

export const AlertsPanel: React.FC = () => {
  const { activeAlerts, alertConfig, updateConfig, resetAlerts, stats } = useAlerts();
  const [newTarget, setNewTarget] = useState<string>('');
  const [percentThreshold, setPercentThreshold] = useState<string>(
    alertConfig.percentageThreshold.toString()
  );
  const [absoluteUp, setAbsoluteUp] = useState<string>(
    alertConfig.absoluteChangeUp?.toString() || '15'
  );
  const [absoluteDown, setAbsoluteDown] = useState<string>(
    alertConfig.absoluteChangeDown?.toString() || '13'
  );

  const addPriceTarget = () => {
    const target = parseFloat(newTarget);
    if (!isNaN(target) && target > 0) {
      updateConfig({
        priceTargets: [...alertConfig.priceTargets, target].sort((a, b) => a - b),
      });
      setNewTarget('');
    }
  };

  const removePriceTarget = (target: number) => {
    updateConfig({
      priceTargets: alertConfig.priceTargets.filter(t => t !== target),
    });
  };

  const updatePercentThreshold = () => {
    const value = parseFloat(percentThreshold);
    if (!isNaN(value) && value > 0) {
      updateConfig({ percentageThreshold: value });
    }
  };

  const updateAbsoluteChanges = () => {
    const upValue = parseFloat(absoluteUp);
    const downValue = parseFloat(absoluteDown);
    if (!isNaN(upValue) && upValue > 0 && !isNaN(downValue) && downValue > 0) {
      updateConfig({ 
        absoluteChangeUp: upValue,
        absoluteChangeDown: downValue 
      });
    }
  };

  return (
    <Card className="bg-black/40 border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alert Configuration
          </CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {activeAlerts.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="bg-black/40 p-2 rounded">
            <div className="text-gray-500">Base Price</div>
            <div className="text-green-400">${stats.basePrice.toFixed(2)}</div>
          </div>
          <div className="bg-black/40 p-2 rounded">
            <div className="text-gray-500">Current Trend</div>
            <div className="text-cyan-400 capitalize">{stats.currentTrend}</div>
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-2 bg-black/40 rounded">
          <div className="flex items-center gap-2">
            {alertConfig.notificationEnabled ? (
              <Bell className="w-4 h-4 text-cyan-400" />
            ) : (
              <BellOff className="w-4 h-4 text-gray-500" />
            )}
            <Label htmlFor="notifications" className="text-xs text-gray-400">
              Telegram Notifications
            </Label>
          </div>
          <Switch
            id="notifications"
            checked={alertConfig.notificationEnabled}
            onCheckedChange={(checked) =>
              updateConfig({ notificationEnabled: checked })
            }
          />
        </div>

        {/* Trend Alerts Toggle */}
        <div className="flex items-center justify-between p-2 bg-black/40 rounded">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <Label htmlFor="trend-alerts" className="text-xs text-gray-400">
              Trend Change Alerts
            </Label>
          </div>
          <Switch
            id="trend-alerts"
            checked={alertConfig.enableTrendAlerts}
            onCheckedChange={(checked) =>
              updateConfig({ enableTrendAlerts: checked })
            }
          />
        </div>

        {/* Percentage Threshold */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Percentage Alert Threshold</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={percentThreshold}
              onChange={(e) => setPercentThreshold(e.target.value)}
              onBlur={updatePercentThreshold}
              placeholder="2.0"
              className="bg-black/40 border-cyan-500/30 text-white text-xs font-mono"
              min="0"
              step="0.1"
            />
            <span className="text-gray-400 text-xs flex items-center">%</span>
          </div>
          <p className="text-[10px] text-gray-500">
            Alert when price moves by this percentage
          </p>
        </div>

        {/* Absolute Price Change Alerts */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Absolute Price Change Alerts</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-green-400">Up Movement</Label>
              <div className="flex gap-1 items-center">
                <span className="text-green-400 text-xs">+$</span>
                <Input
                  type="number"
                  value={absoluteUp}
                  onChange={(e) => setAbsoluteUp(e.target.value)}
                  onBlur={updateAbsoluteChanges}
                  placeholder="15"
                  className="bg-black/40 border-green-500/30 text-white text-xs font-mono"
                  min="0"
                  step="1"
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px] text-red-400">Down Movement</Label>
              <div className="flex gap-1 items-center">
                <span className="text-red-400 text-xs">-$</span>
                <Input
                  type="number"
                  value={absoluteDown}
                  onChange={(e) => setAbsoluteDown(e.target.value)}
                  onBlur={updateAbsoluteChanges}
                  placeholder="13"
                  className="bg-black/40 border-red-500/30 text-white text-xs font-mono"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-500">
            Alert when price moves ±$X from base price
          </p>
        </div>

        {/* Price Targets */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-400 flex items-center gap-2">
            <Target className="w-3 h-3" />
            Price Targets
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') addPriceTarget();
              }}
              placeholder="e.g., 4600"
              className="bg-black/40 border-cyan-500/30 text-white text-xs font-mono"
              min="0"
              step="10"
            />
            <Button
              size="sm"
              onClick={addPriceTarget}
              className="bg-cyan-500/20 hover:bg-cyan-500/30"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {alertConfig.priceTargets.map((target) => (
              <Badge
                key={target}
                variant="outline"
                className="font-mono text-xs flex items-center gap-1"
              >
                ${target}
                <button
                  onClick={() => removePriceTarget(target)}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-400">Recent Alerts</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetAlerts}
                className="h-6 text-xs text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {activeAlerts.slice(-5).reverse().map((alert) => (
                <div
                  key={alert.id}
                  className="bg-black/40 p-2 rounded text-[10px] font-mono"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-cyan-400">
                      {alert.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {alert.message.split('\n')[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="pt-2 border-t border-cyan-500/20">
          <p className="text-[10px] text-gray-500 leading-relaxed">
            💡 Alerts are sent to your Telegram bot when price targets are reached,
            significant price movements occur, or trend changes are detected.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
