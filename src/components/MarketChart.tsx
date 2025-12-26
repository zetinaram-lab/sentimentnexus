import { useMarket } from '@/context/MarketContext';
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

export const MarketChart = () => {
  const { priceData, selectedEventId, events } = useMarket();

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId),
    [events, selectedEventId]
  );

  const chartData = useMemo(() => {
    return priceData.map((point) => ({
      time: point.timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      price: point.price,
      timestamp: point.timestamp.getTime(),
      hasEvent: point.eventId === selectedEventId,
    }));
  }, [priceData, selectedEventId]);

  const currentPrice = priceData[priceData.length - 1]?.price ?? 2650.00;
  const previousPrice = priceData[priceData.length - 2]?.price ?? currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(3);
  const isPositive = priceChange >= 0;

  const selectedEventTimestamp = selectedEvent?.timestamp.getTime();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-accent" />
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
              XAU/USD
            </h2>
            <p className="text-xs text-muted-foreground">Gold Spot</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-mono font-semibold text-foreground">
            ${currentPrice.toFixed(2)}
          </p>
          <p
            className={`text-sm font-mono ${
              isPositive ? 'text-success' : 'text-destructive'
            }`}
          >
            {isPositive ? '+' : ''}
            {priceChange.toFixed(2)} ({priceChangePercent}%)
          </p>
        </div>
      </div>

      <div className="flex-1 p-4">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                itemStyle={{ color: 'hsl(var(--accent))' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              />
              {selectedEventTimestamp && (
                <ReferenceLine
                  x={chartData.find(
                    (d) =>
                      Math.abs(d.timestamp - selectedEventTimestamp) < 5000
                  )?.time}
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: 'EVENT',
                    fill: 'hsl(var(--accent))',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: 'hsl(var(--accent))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-accent/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Initializing price stream...
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="p-3 mx-4 mb-4 rounded-lg bg-accent/5 border border-accent/20">
          <p className="text-xs text-accent font-medium mb-1">
            Selected Event Highlight
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {selectedEvent.content}
          </p>
        </div>
      )}
    </div>
  );
};
