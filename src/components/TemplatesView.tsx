import React from 'react';
import {
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  Flame,
  ArrowRight,
  Play
} from 'lucide-react';
import { VIRAL_TEMPLATES } from '../data/mockTemplates';
import { VideoProject } from '../types';

interface TemplatesViewProps {
  onUseTemplate: (niche: string, prompt: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onUseTemplate }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Battle-Tested Viral Formats</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Viral Video Templates
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Pre-engineered hooks, retention pacing, and visual aesthetics with proven millions of views.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VIRAL_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-rose-500/5"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={tpl.thumbnailUrl}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                  {tpl.badge}
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono text-slate-200 border border-slate-800">
                  {tpl.duration}s
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  {tpl.niche}
                </div>
                <h3 className="text-base font-extrabold text-white group-hover:text-rose-400 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Hook Box */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 font-mono">
                  <span className="text-amber-400 font-bold">Hook Formula: </span>
                  "{tpl.hookSample}"
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
                  <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{tpl.estimatedViews} Avg Views</span>
                  </div>
                  <span className="font-mono">{tpl.style}</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800">
              <button
                id={`btn-use-template-${tpl.id}`}
                onClick={() => onUseTemplate(tpl.niche, tpl.hookSample)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-rose-500/20 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Use This Template</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
