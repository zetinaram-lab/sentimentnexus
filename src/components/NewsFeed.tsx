import { useMarket } from '@/context/MarketContext';
import { cn } from '@/lib/utils';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const reliabilityColors = {
  high: 'bg-accent/20 text-accent border-accent/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  low: 'bg-muted text-muted-foreground border-border',
};

const impactIcons = {
  bullish: TrendingUp,
  bearish: TrendingDown,
  neutral: Minus,
};

const impactColors = {
  bullish: 'text-success',
  bearish: 'text-destructive',
  neutral: 'text-muted-foreground',
};

export const NewsFeed = () => {
  const { events, selectedEventId, selectEvent } = useMarket();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Intelligence Feed
          </h2>
        </div>
        <span className="px-2 py-0.5 text-xs font-mono bg-accent/10 text-accent rounded">
          {events.length} signals
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Waiting for market intelligence...
          </div>
        ) : (
          <div className="divide-y divide-border">
            {events.map((event) => {
              const ImpactIcon = impactIcons[event.impact];
              const isSelected = selectedEventId === event.id;

              return (
                <div
                  key={event.id}
                  onClick={() => selectEvent(isSelected ? null : event.id)}
                  className={cn(
                    'p-4 cursor-pointer transition-all duration-200',
                    'hover:bg-card-hover',
                    isSelected && 'bg-accent/5 border-l-2 border-l-accent'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed">
                        {event.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {event.timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {event.source}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded border',
                          reliabilityColors[event.reliability]
                        )}
                      >
                        {event.reliability.toUpperCase()}
                      </span>
                      <ImpactIcon
                        className={cn('w-4 h-4', impactColors[event.impact])}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
