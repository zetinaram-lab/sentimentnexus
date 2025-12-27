/**
 * Sponsored Banner Component
 * Subtle sponsored content that provides value to users
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ExternalLink } from 'lucide-react';

interface SponsoredBannerProps {
  compact?: boolean;
}

export const SponsoredBanner: React.FC<SponsoredBannerProps> = ({ compact = false }) => {
  // You can rotate different sponsors here
  const currentSponsor = {
    title: 'Unlock Premium Gold Insights',
    description: 'Get advanced technical analysis, AI predictions, and priority alerts',
    ctaText: 'Try Premium Free',
    url: '#premium',
    tag: 'Limited Time',
    isInternal: true // Set false for external sponsors
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-3">
        <a 
          href={currentSponsor.url}
          target={currentSponsor.isInternal ? '_self' : '_blank'}
          rel={currentSponsor.isInternal ? '' : 'noopener noreferrer sponsored'}
          className="flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 rounded">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-semibold">{currentSponsor.title}</span>
                {currentSponsor.tag && (
                  <span className="px-1.5 py-0.5 bg-pink-500/20 text-pink-400 text-[9px] rounded-full border border-pink-500/30">
                    {currentSponsor.tag}
                  </span>
                )}
              </div>
              <span className="text-gray-400 text-[10px]">{currentSponsor.description}</span>
            </div>
          </div>
          <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 border-purple-500/30 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-sm">{currentSponsor.title}</h3>
              {currentSponsor.tag && (
                <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 text-[10px] rounded-full border border-pink-500/30">
                  {currentSponsor.tag}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs mb-3">
              {currentSponsor.description}
            </p>
            <a
              href={currentSponsor.url}
              target={currentSponsor.isInternal ? '_self' : '_blank'}
              rel={currentSponsor.isInternal ? '' : 'noopener noreferrer sponsored'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
              {currentSponsor.ctaText}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <p className="text-gray-500 text-[9px] text-right mt-3">
          Sponsored · Learn More
        </p>
      </CardContent>
    </Card>
  );
};
