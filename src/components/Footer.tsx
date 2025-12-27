/**
 * Footer Component
 * Community-first footer with creator info and social links
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Github, Linkedin, Heart, Code, Coffee, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <Card className="mt-8 bg-black/40 border-cyan-500/30">
      <div className="p-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Creator Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold text-sm">Creado por</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-xs">
                Proyecto desarrollado con ❤️ para la comunidad de trading
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/ramseszetina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-1.5 rounded group-hover:scale-110 transition-transform">
                    <Linkedin className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs">LinkedIn</span>
                </a>
                <a
                  href="https://github.com/zetinaram-lab/sentimentnexus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group"
                >
                  <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-1.5 rounded group-hover:scale-110 transition-transform">
                    <Github className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <h3 className="text-white font-semibold text-sm">Sobre el Proyecto</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-400">
              <p>• 100% gratuito y open source</p>
              <p>• Sin anuncios invasivos</p>
              <p>• Actualizaciones constantes</p>
              <p>• Creado por traders, para traders</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-orange-400" />
              <h3 className="text-white font-semibold text-sm">Tecnologías</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Tailwind', 'Vite', 'Chart.js', 'Telegram Bot'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] rounded border border-cyan-500/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-xs">Hecho con</span>
                <Heart className="w-3 h-3 text-pink-500 animate-pulse" />
                <span className="text-gray-400 text-xs">para la comunidad</span>
              </div>
              
              {/* AI Transparency Badge */}
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] rounded border border-purple-500/30">
                <Sparkles className="w-3 h-3" />
                <span>Built with AI assistance</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] text-gray-500">
              <span>© 2025 SentimentNexus</span>
              <span>•</span>
              <a 
                href="https://github.com/zetinaram-lab/sentimentnexus/blob/main/ABOUT_THE_PROJECT.md" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
              >
                About
              </a>
              <span>•</span>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Términos
              </a>
              <span>•</span>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Privacidad
              </a>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/30">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Open Source
              </div>
            </div>
          </div>
        </div>

        {/* Optional: Disclaimer */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-[10px] text-center leading-relaxed">
            ⚠️ Disclaimer: Esta herramienta es solo para fines educativos. No constituye asesoría financiera.
            Siempre investiga antes de invertir.
          </p>
        </div>
      </div>
    </Card>
  );
};
