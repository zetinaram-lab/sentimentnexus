/**
 * Support Button Component
 * Non-aggressive donation option for users who want to support
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Coffee, Bitcoin, DollarSign } from 'lucide-react';

export const SupportButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const donationOptions = [
    {
      name: 'Buy Me a Coffee',
      url: 'https://www.buymeacoffee.com/sentimentnexus',
      icon: <Coffee className="w-4 h-4" />,
      color: 'from-yellow-500 to-orange-500',
      description: '$5 - Support development'
    },
    {
      name: 'PayPal',
      url: 'https://paypal.me/sentimentnexus',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'One-time donation'
    },
    {
      name: 'Crypto (BTC)',
      url: '#',
      icon: <Bitcoin className="w-4 h-4" />,
      color: 'from-orange-500 to-yellow-500',
      description: 'bc1q...address',
      isCrypto: true
    }
  ];

  return (
    <Card className="bg-black/40 border-pink-500/30 overflow-hidden">
      <CardContent className="p-4">
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-lg">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold text-sm">☕ Apoya el Proyecto</h3>
                  <p className="text-gray-400 text-xs">Si te resulta útil (opcional)</p>
                </div>
              </div>
              <div className="text-pink-400 group-hover:text-pink-300 transition-colors">
                <span className="text-xs">→</span>
              </div>
            </div>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <h3 className="text-white font-semibold text-sm">Opciones de Apoyo</h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {donationOptions.map((option, index) => (
                <a
                  key={index}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block ${option.isCrypto ? 'cursor-default' : ''}`}
                  onClick={(e) => {
                    if (option.isCrypto) {
                      e.preventDefault();
                      navigator.clipboard.writeText('bc1qyour_bitcoin_address_here');
                      alert('Bitcoin address copied to clipboard!');
                    }
                  }}
                >
                  <div className="bg-gradient-to-r from-black/60 to-black/40 border border-gray-700/50 rounded-lg p-3 hover:border-pink-500/50 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-br ${option.color} p-2 rounded-lg`}>
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-xs font-medium">{option.name}</h4>
                        <p className="text-gray-400 text-[10px] mt-0.5">{option.description}</p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3 mt-3">
              <p className="text-pink-400 text-[10px] text-center leading-relaxed">
                ❤️ Proyecto 100% gratuito y open source
              </p>
              <p className="text-gray-400 text-[10px] text-center mt-1">
                Tu apoyo ayuda a mantenerlo vivo y sin ads
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
