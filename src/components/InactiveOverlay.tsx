/**
 * Inactive System Overlay
 * Displays when terminal is not configured with API credentials
 */

import { Shield, Settings, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InactiveOverlayProps {
  onNavigateToSettings: () => void;
}

export const InactiveOverlay = ({ onNavigateToSettings }: InactiveOverlayProps) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="max-w-md mx-auto text-center p-8">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 mb-6">
          <Shield className="w-8 h-8 text-accent" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Terminal Inactive
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Configure your WhatsApp API credentials to activate the intelligence 
          terminal and begin receiving real-time market signals.
        </p>

        {/* Status Indicators */}
        <div className="flex flex-col gap-2 mb-8 p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">API Key Status</span>
            <span className="px-2 py-0.5 rounded bg-destructive/20 text-destructive text-xs font-medium">
              NOT CONFIGURED
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Webhook Status</span>
            <span className="px-2 py-0.5 rounded bg-destructive/20 text-destructive text-xs font-medium">
              NOT CONFIGURED
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Alert System</span>
            <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-medium">
              STANDBY
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onNavigateToSettings}
          className="w-full group"
          size="lg"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configure Terminal
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>

        {/* Help Text */}
        <p className="mt-4 text-xs text-muted-foreground">
          Need help? Check the documentation for API setup instructions.
        </p>
      </div>
    </div>
  );
};
