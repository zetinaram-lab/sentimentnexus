/**
 * Analytics Panel Component
 * Displays Alpha Tracker metrics, volatility indicators, and signal history
 * Includes CSV export functionality
 */

import { useMarket } from '@/context/MarketContext';
import { useMemo } from 'react';
import {
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Percent,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { exportAlphaLog } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

export const AnalyticsPanel = () => {
  const { alphaSignals, events, priceData } = useMarket();
  const { toast } = useToast();

  // Calculate aggregate statistics
  const stats = useMemo(() => {
    if (alphaSignals.length === 0) {
      return {
        avgLag: 0,
        fastestLag: 0,
        bullishCount: 0,
        bearishCount: 0,
        avgCorrelation: 0,
        highCorrelationCount: 0,
      };
    }

    const lags = alphaSignals.map((s) => s.lagSeconds);
    const avgLag = lags.reduce((a, b) => a + b, 0) / lags.length;
    const fastestLag = Math.min(...lags);
    const bullishCount = alphaSignals.filter((s) => s.direction === 'up').length;
    const bearishCount = alphaSignals.filter((s) => s.direction === 'down').length;

    const correlations = alphaSignals
      .filter((s) => s.correlationScore !== undefined)
      .map((s) => s.correlationScore!);
    const avgCorrelation =
      correlations.length > 0
        ? correlations.reduce((a, b) => a + b, 0) / correlations.length
        : 0;
    const highCorrelationCount = correlations.filter((c) => c > 80).length;

    return {
      avgLag,
      fastestLag,
      bullishCount,
      bearishCount,
      avgCorrelation,
      highCorrelationCount,
    };
  }, [alphaSignals]);

  // Calculate session volatility
  const volatility = useMemo(() => {
    if (priceData.length < 2) return 0;
    const prices = priceData.map((p) => p.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance =
      prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
    return Math.sqrt(variance);
  }, [priceData]);

  // Handle CSV export
  const handleExport = () => {
    if (alphaSignals.length === 0) {
      toast({
        title: 'No Data to Export',
        description: 'Wait for alpha signals to be detected before exporting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      exportAlphaLog(alphaSignals, events);
      toast({
        title: 'Export Complete',
        description: `Downloaded ${alphaSignals.length} alpha signals to CSV.`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Unable to generate CSV file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Alpha Tracker
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="h-7 text-xs gap-1.5"
        >
          <Download className="w-3 h-3" />
          Export
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Avg Lag
              </span>
            </div>
            <p className="text-lg font-mono font-semibold text-foreground">
              {stats.avgLag.toFixed(1)}s
            </p>
          </div>

          <div className="p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Fastest
              </span>
            </div>
            <p className="text-lg font-mono font-semibold text-foreground">
              {stats.fastestLag > 0 ? `${stats.fastestLag.toFixed(1)}s` : '--'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Bullish
              </span>
            </div>
            <p className="text-lg font-mono font-semibold text-success">
              {stats.bullishCount}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-3.5 h-3.5 text-destructive" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Bearish
              </span>
            </div>
            <p className="text-lg font-mono font-semibold text-destructive">
              {stats.bearishCount}
            </p>
          </div>
        </div>

        {/* Correlation Metrics */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Percent className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Avg Correlation
              </span>
            </div>
            <span
              className={cn(
                'text-xs font-mono px-2 py-0.5 rounded',
                stats.avgCorrelation > 70
                  ? 'bg-success/20 text-success'
                  : stats.avgCorrelation > 50
                  ? 'bg-warning/20 text-warning'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {stats.avgCorrelation.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.highCorrelationCount} high-correlation signals detected
          </p>
        </div>

        {/* Volatility Indicator */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Session Volatility
            </span>
            <span
              className={cn(
                'text-xs font-mono px-2 py-0.5 rounded',
                volatility > 5
                  ? 'bg-destructive/20 text-destructive'
                  : volatility > 2
                  ? 'bg-warning/20 text-warning'
                  : 'bg-success/20 text-success'
              )}
            >
              {volatility > 5 ? 'HIGH' : volatility > 2 ? 'MODERATE' : 'LOW'}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                volatility > 5
                  ? 'bg-destructive'
                  : volatility > 2
                  ? 'bg-warning'
                  : 'bg-success'
              )}
              style={{ width: `${Math.min(volatility * 10, 100)}%` }}
            />
          </div>
          <p className="text-right text-xs font-mono text-muted-foreground mt-1">
            σ = {volatility.toFixed(2)}
          </p>
        </div>

        {/* Recent Signals */}
        <div>
          <h3 className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            Recent Alpha Signals
          </h3>
          {alphaSignals.length === 0 ? (
            <div className="p-4 rounded-lg border border-dashed border-border text-center">
              <p className="text-sm text-muted-foreground">
                No signals detected yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {alphaSignals.slice(0, 5).map((signal, index) => (
                <div
                  key={`${signal.eventId}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border"
                >
                  <div className="flex items-center gap-2">
                    {signal.direction === 'up' ? (
                      <TrendingUp className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                    )}
                    <span className="text-xs font-mono text-muted-foreground">
                      {signal.eventTimestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {signal.correlationScore !== undefined && (
                      <span
                        className={cn(
                          'text-xs font-mono',
                          signal.correlationScore > 80
                            ? 'text-success'
                            : signal.correlationScore > 50
                            ? 'text-warning'
                            : 'text-muted-foreground'
                        )}
                      >
                        {signal.correlationScore.toFixed(0)}%
                      </span>
                    )}
                    <span className="text-xs font-mono text-accent">
                      +{signal.lagSeconds.toFixed(1)}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
