import { MarketProvider } from '@/context/MarketContext';
import { NewsFeed } from '@/components/NewsFeed';
import { MarketChart } from '@/components/MarketChart';
import { AnalyticsPanel } from '@/components/AnalyticsPanel';
import { WhatsAppSettings } from '@/components/WhatsAppSettings';
import { useDataStream } from '@/hooks/useDataStream';
import { Activity, Shield } from 'lucide-react';

const Dashboard = () => {
  useDataStream();

  return (
    <div className="min-h-screen bg-background text-foreground">
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-xs font-medium text-success">LIVE</span>
            </div>

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

      {/* Main Grid */}
      <main className="p-4 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-120px)]">
          {/* Left Column - News Feed */}
          <div className="lg:col-span-3 rounded-xl bg-card border border-border overflow-hidden">
            <NewsFeed />
          </div>

          {/* Center Column - Chart */}
          <div className="lg:col-span-6 rounded-xl bg-card border border-border overflow-hidden">
            <MarketChart />
          </div>

          {/* Right Column - Analytics & Settings */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex-1 rounded-xl bg-card border border-border overflow-hidden">
              <AnalyticsPanel />
            </div>
            <div className="h-[320px] rounded-xl bg-card border border-border overflow-hidden">
              <WhatsAppSettings />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <MarketProvider>
      <Dashboard />
    </MarketProvider>
  );
};

export default Index;
