/**
 * Affiliate Links Component
 * Non-aggressive monetization through affiliate partnerships
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, TrendingUp, Shield, Zap } from 'lucide-react';

export const AffiliateLinks: React.FC = () => {
  const affiliates = [
    {
      name: 'Binance',
      description: 'Trade PAXG with 0 fees',
      url: 'https://www.binance.com/en/register?ref=YOUR_BINANCE_REF',
      badge: 'Get 20% Off Fees',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Coinbase',
      description: 'Buy gold backed crypto',
      url: 'https://www.coinbase.com/join/YOUR_COINBASE_REF',
      badge: 'Get $10 Free',
      icon: <Shield className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'KuCoin',
      description: 'Trade XAU with leverage',
      url: 'https://www.kucoin.com/r/YOUR_KUCOIN_REF',
      badge: 'New User Bonus',
      icon: <Zap className="w-4 h-4" />,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <Card className="bg-black/40 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          🎓 Recursos Recomendados
        </CardTitle>
        <p className="text-gray-400 text-xs mt-1">
          Plataformas confiables para invertir en oro y cripto
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {affiliates.map((affiliate, index) => (
          <a
            key={index}
            href={affiliate.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block group"
          >
            <div className="bg-gradient-to-r from-black/60 to-black/40 border border-gray-700/50 rounded-lg p-3 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`bg-gradient-to-br ${affiliate.color} p-2 rounded-lg`}>
                    {affiliate.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold text-sm">{affiliate.name}</h3>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">{affiliate.description}</p>
                    {affiliate.badge && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[10px] rounded-full border border-cyan-500/30">
                        {affiliate.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
        <p className="text-gray-500 text-[10px] text-center mt-3 leading-relaxed">
          💡 <span className="text-gray-400">Enlaces de afiliado</span> - Estos recursos ayudan a mantener el proyecto gratuito para todos. Sin costo adicional para ti.
        </p>
      </CardContent>
    </Card>
  );
};
