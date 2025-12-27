/**
 * Donation Button Component
 * Simple, non-intrusive donation option using PayPal
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ExternalLink } from 'lucide-react';

export const DonationButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const paypalUrl = 'https://paypal.me/ramszet';

  return (
    <Card className="bg-black/40 border-pink-500/30 overflow-hidden">
      <CardContent className="p-4">
        {!isExpanded ? (
          // Collapsed state - small button
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    ☕ Apoya el Proyecto
                  </p>
                  <p className="text-xs text-gray-400">
                    Si te resulta útil (100% opcional)
                  </p>
                </div>
              </div>
              <div className="text-xs text-pink-400 group-hover:text-pink-300">
                Ver →
              </div>
            </div>
          </button>
        ) : (
          // Expanded state - donation info
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-semibold text-white">
                  Apoya el Desarrollo
                </h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Message */}
              <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Este proyecto es <strong className="text-cyan-400">100% gratuito</strong> y 
                  <strong className="text-cyan-400"> open source</strong>. 
                  Si te resulta útil, considera apoyar su desarrollo.
                </p>
              </div>

              {/* Donation button */}
              <a
                href={paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all group"
              >
                <svg 
                  className="w-5 h-5" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.993-.032.17a.804.804 0 0 1-.794.679H7.72a.483.483 0 0 1-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502z"/>
                  <path d="M2.991 8.527c-.357 2.286.012 3.84.988 5.018.824.997 2.033 1.548 3.667 1.548h.515c.413 0 .764.282.86.69l.477 3.022.032.17c.043.239.246.416.487.416h2.046c.216 0 .397-.158.431-.368l.633-4.015.04-.22c.097-.407.448-.689.862-.689h.515c3.238 0 5.774-1.314 6.514-5.12.256-1.313.192-2.447-.3-3.327C19.95 3.678 17.694 2.5 14.621 2.5H7.379c-.415 0-.77.298-.86.707L4.27 14.788h2.006l1.935-12.266h6.41c2.329 0 4.113.781 5.005 2.196z"/>
                </svg>
                <span className="font-medium">Donar con PayPal</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Footer note */}
              <p className="text-[10px] text-center text-gray-500">
                Cualquier cantidad es apreciada 💙
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
