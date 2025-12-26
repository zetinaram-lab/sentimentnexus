/**
 * Telegram Settings Component
 * Configuration panel for Telegram Bot with stats and quick actions
 */

import { useState } from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Send,
  RotateCcw,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMarket } from '@/context/MarketContext';

const BOT_USERNAME = '@SentimentNexusBot';
const BOT_LINK = 'https://t.me/SentimentNexusBot';

export const TelegramSettings = () => {
  const { toast } = useToast();
  const { resetTerminal } = useMarket();
  const { alertConfig, updateConfig, resetAlerts, stats, activeAlerts } = useAlerts();
  const [isSendingTest, setIsSendingTest] = useState(false);

  /**
   * Send test message to Telegram
   */
  const handleSendTest = async () => {
    setIsSendingTest(true);
    try {
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `🧪 *Test Message*\n\nTelegram bot is working correctly!\n\n⏰ ${new Date().toLocaleString('es-ES')}`,
        }),
      });

      if (response.ok) {
        toast({
          title: '✅ Test Sent',
          description: 'Check your Telegram for the test message.',
        });
      } else {
        throw new Error('Failed to send test message');
      }
    } catch (error) {
      toast({
        title: '❌ Test Failed',
        description: 'Could not send test message. Check bot configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  /**
   * Handle terminal reset
   */
  const handleReset = () => {
    if (window.confirm('This will clear all saved data and configurations. Continue?')) {
      resetTerminal();
      resetAlerts();
      toast({
        title: 'Terminal Reset',
        description: 'All data and alerts have been cleared.',
      });
    }
  };

  /**
   * Open Telegram bot
   */
  const handleOpenBot = () => {
    window.open(BOT_LINK, '_blank');
  };

  return (
    <Card className="bg-black/40 border-cyan-500/30 h-full flex flex-col">
      {/* Header */}
      <CardHeader className="border-b border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-cyan-400">
              Telegram Bot
            </h2>
          </div>
          <div
            className={cn(
              'flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium',
              alertConfig.notificationEnabled
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'
            )}
          >
            {alertConfig.notificationEnabled ? (
              <>
                <CheckCircle className="w-3 h-3" />
                ACTIVE
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" />
                INACTIVE
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Bot Info Card */}
        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-cyan-400">Bot Username</p>
              <p className="text-xs text-gray-400 font-mono mt-1">{BOT_USERNAME}</p>
            </div>
            <Button
              onClick={handleOpenBot}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
          <Button
            onClick={handleOpenBot}
            className="w-full mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
            size="sm"
          >
            Open in Telegram
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-black/40 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <p className="text-[10px] text-gray-400 uppercase">Base Price</p>
            </div>
            <p className="text-lg font-bold text-cyan-400 font-mono">
              ${stats.basePrice.toFixed(2)}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <p className="text-[10px] text-gray-400 uppercase">Alerts</p>
            </div>
            <p className="text-lg font-bold text-cyan-400 font-mono">
              {activeAlerts.length}
            </p>
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-cyan-500/20">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-sm font-medium text-white">Enable Notifications</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Receive alerts via Telegram
            </p>
          </div>
          <Switch
            checked={alertConfig.notificationEnabled}
            onCheckedChange={(checked) => {
              updateConfig({ notificationEnabled: checked });
              toast({
                title: checked ? 'Notifications Enabled' : 'Notifications Disabled',
                description: checked
                  ? 'You will receive alerts on Telegram.'
                  : 'Telegram alerts have been disabled.',
              });
            }}
          />
        </div>

        {/* Alert Config Summary */}
        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
          <p className="text-xs text-cyan-400 font-medium mb-2 uppercase">Alert Config</p>
          <div className="space-y-1.5 text-xs text-gray-300">
            <div className="flex items-center justify-between">
              <span>Percentage Change:</span>
              <Badge variant="outline" className="font-mono">
                ±{alertConfig.percentageThreshold}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Up Movement:</span>
              <Badge variant="outline" className="font-mono text-green-400">
                +${alertConfig.absoluteChangeUp}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Down Movement:</span>
              <Badge variant="outline" className="font-mono text-red-400">
                -${alertConfig.absoluteChangeDown}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Price Targets:</span>
              <Badge variant="outline" className="font-mono">
                {alertConfig.priceTargets.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="p-3 rounded-lg bg-black/40 border border-cyan-500/20">
          <p className="text-xs text-gray-400 font-medium mb-2 uppercase">Quick Commands</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="p-2 bg-cyan-500/10 rounded">
              <code className="text-cyan-400">/price</code>
              <p className="text-gray-500 mt-0.5">Current price</p>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded">
              <code className="text-cyan-400">/alerts</code>
              <p className="text-gray-500 mt-0.5">View alerts</p>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded">
              <code className="text-cyan-400">/status</code>
              <p className="text-gray-500 mt-0.5">System status</p>
            </div>
            <div className="p-2 bg-cyan-500/10 rounded">
              <code className="text-cyan-400">/help</code>
              <p className="text-gray-500 mt-0.5">All commands</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleSendTest}
            disabled={isSendingTest || !alertConfig.notificationEnabled}
            className="w-full gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
          >
            <Send className="w-4 h-4" />
            {isSendingTest ? 'Sending...' : 'Send Test Message'}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full gap-2 text-gray-400 hover:text-red-400 hover:border-red-400"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Terminal
          </Button>
        </div>

        {/* Info */}
        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
          <p className="text-xs text-cyan-400 font-medium mb-2">Integration Info</p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Real-time price alerts via Telegram</li>
            <li>• Control system with bot commands</li>
            <li>• Free, unlimited notifications</li>
            <li>• Secure serverless functions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
