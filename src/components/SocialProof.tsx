/**
 * Social Proof Component
 * Subtle social proof to build trust without being misleading
 */

import React from 'react';
import { Users, TrendingUp, Github, Star } from 'lucide-react';

export const SocialProof: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-cyan-500/10 via-transparent to-pink-500/10 border-y border-cyan-500/20 py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/30">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium">Sistema Activo</span>
            </div>
          </div>

          {/* Community Growth */}
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs">Comunidad en Crecimiento</span>
          </div>

          {/* Real-time Updates */}
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-xs">Actualización en Tiempo Real</span>
          </div>

          {/* Open Source Badge */}
          <a
            href="https://github.com/zetinaram-lab/sentimentnexus"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
          >
            <Github className="w-4 h-4" />
            <span className="text-xs">Open Source</span>
            <Star className="w-3 h-3 text-yellow-500 group-hover:scale-110 transition-transform" />
          </a>

          {/* 100% Free */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/30">
            <span className="text-xs font-medium">100% Gratuito</span>
          </div>
        </div>
      </div>
    </div>
  );
};
