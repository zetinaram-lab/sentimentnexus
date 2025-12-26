/**
 * Technical Indicators Panel
 * Displays RSI, MACD, Bollinger Bands and trading recommendations
 */

import React, { useMemo } from 'react';
import { useMarket } from '@/context/MarketContext';
import TechnicalIndicatorsService from '@/services/technicalIndicators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const TechnicalIndicatorsPanel: React.FC = () => {
  const { priceData } = useMarket();

  const indicators = useMemo(() => {
    if (priceData.length < 50) return null;
    return TechnicalIndicatorsService.getAllIndicators(priceData);
  }, [priceData]);

  if (!indicators) {
    return (
      <Card className="bg-black/40 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm">Technical Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-xs">Collecting data... (need 50+ points)</p>
        </CardContent>
      </Card>
    );
  }

  const { rsi, macd, bollingerBands, sma20, sma50, recommendation } = indicators;
  const currentPrice = priceData[priceData.length - 1]?.price || 0;

  return (
    <Card className="bg-black/40 border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyan-400 text-sm">Technical Indicators</CardTitle>
          <Badge
            variant={
              recommendation === 'BUY'
                ? 'default'
                : recommendation === 'SELL'
                ? 'destructive'
                : 'secondary'
            }
            className="font-mono text-xs"
          >
            {recommendation}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* RSI Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs font-mono">RSI (14)</span>
            <span className={`text-xs font-mono ${getRSIColor(rsi)}`}>
              {rsi.toFixed(2)}
            </span>
          </div>
          <Progress value={rsi} className="h-1" />
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>Oversold (&lt;30)</span>
            <span>Neutral</span>
            <span>Overbought (&gt;70)</span>
          </div>
        </div>

        {/* MACD */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs font-mono">MACD</span>
            {macd.histogram > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div className="bg-black/40 p-1.5 rounded">
              <div className="text-gray-500">Value</div>
              <div className="text-white">{macd.value.toFixed(2)}</div>
            </div>
            <div className="bg-black/40 p-1.5 rounded">
              <div className="text-gray-500">Signal</div>
              <div className="text-white">{macd.signal.toFixed(2)}</div>
            </div>
            <div className="bg-black/40 p-1.5 rounded">
              <div className="text-gray-500">Hist</div>
              <div className={macd.histogram > 0 ? 'text-green-500' : 'text-red-500'}>
                {macd.histogram.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="space-y-1">
          <span className="text-gray-400 text-xs font-mono">Bollinger Bands</span>
          <div className="relative h-12 bg-black/40 rounded overflow-hidden">
            {/* Visual representation */}
            <div className="absolute inset-0 flex items-center px-2">
              <div className="w-full relative h-6">
                {/* Upper band */}
                <div className="absolute top-0 w-full h-px bg-red-500/50" />
                {/* Middle band (SMA) */}
                <div className="absolute top-1/2 w-full h-px bg-cyan-500/50" />
                {/* Lower band */}
                <div className="absolute bottom-0 w-full h-px bg-green-500/50" />
                {/* Current price indicator */}
                <div
                  className="absolute w-2 h-2 bg-yellow-500 rounded-full transform -translate-x-1 -translate-y-1"
                  style={{
                    left: '50%',
                    top: `${getRelativePosition(
                      currentPrice,
                      bollingerBands.lower,
                      bollingerBands.upper
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
            <div className="text-green-500">L: ${bollingerBands.lower.toFixed(2)}</div>
            <div className="text-cyan-500 text-center">M: ${bollingerBands.middle.toFixed(2)}</div>
            <div className="text-red-500 text-right">U: ${bollingerBands.upper.toFixed(2)}</div>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="space-y-1">
          <span className="text-gray-400 text-xs font-mono">Moving Averages</span>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-black/40 p-1.5 rounded">
              <div className="text-gray-500">SMA 20</div>
              <div className="flex items-center gap-1">
                <span className="text-white">${sma20.toFixed(2)}</span>
                {getTrendIcon(currentPrice, sma20)}
              </div>
            </div>
            <div className="bg-black/40 p-1.5 rounded">
              <div className="text-gray-500">SMA 50</div>
              <div className="flex items-center gap-1">
                <span className="text-white">${sma50.toFixed(2)}</span>
                {getTrendIcon(currentPrice, sma50)}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-2 border-t border-cyan-500/20">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            {getRecommendationText(recommendation, rsi, macd.histogram)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
function getRSIColor(rsi: number): string {
  if (rsi > 70) return 'text-red-500';
  if (rsi < 30) return 'text-green-500';
  return 'text-yellow-500';
}

function getRelativePosition(value: number, min: number, max: number): number {
  const range = max - min;
  const position = ((value - min) / range) * 100;
  return 100 - Math.max(0, Math.min(100, position)); // Invert for visual representation
}

function getTrendIcon(current: number, ma: number) {
  if (current > ma) {
    return <TrendingUp className="w-3 h-3 text-green-500" />;
  } else if (current < ma) {
    return <TrendingDown className="w-3 h-3 text-red-500" />;
  }
  return <Minus className="w-3 h-3 text-gray-500" />;
}

function getRecommendationText(
  recommendation: 'BUY' | 'SELL' | 'HOLD',
  rsi: number,
  macdHist: number
): string {
  if (recommendation === 'BUY') {
    return '✅ Oversold conditions detected. RSI below 30 and MACD turning bullish. Potential buying opportunity.';
  } else if (recommendation === 'SELL') {
    return '⚠️ Overbought conditions detected. RSI above 70 and MACD turning bearish. Consider taking profits.';
  } else {
    return '➡️ Neutral market conditions. Wait for clearer signals before entering a position.';
  }
}

export default TechnicalIndicatorsPanel;
