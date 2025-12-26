/**
 * SentimentNexus - Main Dashboard
 * Institutional Intelligence Terminal for XAU/USD Market Analysis
 */

import { useRef } from 'react';
import { MarketProvider, useMarket } from '@/context/MarketContext';
import { NewsFeed } from '@/components/NewsFeed';
import { MarketChart } from '@/components/MarketChart';
import { AnalyticsPanel } from '@/components/AnalyticsPanel';
import { TelegramSettings } from '@/components/TelegramSettings';
import { TechnicalIndicatorsPanel } from '@/components/TechnicalIndicatorsPanel';
import { AlertsPanel } from '@/components/AlertsPanel';
import { InactiveOverlay } from '@/components/InactiveOverlay';
import { useDataStream } from '@/hooks/useDataStream';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';
import { FEATURES } from '@/config/constants';
import { Shield } from 'lucide-react';

/**
 * Dashboard Content - Requires MarketProvider context
 */
const DashboardContent = () => {
  // Use ONLY real prices (never mock data)
  useRealTimePrices({ enabled: true });
  // useDataStream solo genera eventos de noticias, NO precios
  useDataStream();
  
  const { isTerminalActive } = useMarket();
  const settingsRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll to settings panel when user clicks configure
   */
  const handleNavigateToSettings = () => {
    settingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Inactive Overlay */}
      {!isTerminalActive && (
        <InactiveOverlay onNavigateToSettings={handleNavigateToSettings} />
      )}

      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                SentimentNexus
              </h1>
              <p className="text-xs text-muted-foreground">
                Institutional Intelligence Terminal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Indicator */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                isTerminalActive
                  ? 'bg-success/10 border-success/20'
                  : 'bg-muted border-border'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isTerminalActive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isTerminalActive ? 'bg-success' : 'bg-muted-foreground'
                  }`}
                />
              </span>
              <span
                className={`text-xs font-medium ${
                  isTerminalActive ? 'text-success' : 'text-muted-foreground'
                }`}
              >
                {isTerminalActive ? 'LIVE' : 'STANDBY'}
              </span>
            </div>

            {/* Session Date */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Session</p>
              <p className="text-sm font-mono text-foreground">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="p-4 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-120px)]">
          {/* Left Column - Intelligence Feed */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
            <div className="flex-1 rounded-xl bg-card border border-border overflow-hidden">
              <NewsFeed />
            </div>
            {/* Technical Indicators */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <TechnicalIndicatorsPanel />
            </div>
          </div>

          {/* Center Column - Market Chart */}
          <div className="lg:col-span-6 rounded-xl bg-card border border-border overflow-hidden">
            <MarketChart />
          </div>

          {/* Right Column - Analytics & Settings */}
          <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
            {/* Analytics Panel */}
            <div className="flex-1 rounded-xl bg-card border border-border overflow-hidden min-h-0">
              <AnalyticsPanel />
            </div>

            {/* Alerts Panel */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <AlertsPanel />
            </div>

            {/* Telegram Settings */}
            <div
              ref={settingsRef}
              className="flex-1 min-h-[400px] max-h-[500px] rounded-xl bg-card border border-border overflow-hidden"
            >
              <TelegramSettings />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * Index Page - Wraps dashboard with MarketProvider
 */
const Index = () => {
  return (
    <MarketProvider>
      <DashboardContent />
    </MarketProvider>
  );
};

export default Index;
