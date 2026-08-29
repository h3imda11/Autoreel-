import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle,
  RefreshCw,
  Share2,
  Filter
} from 'lucide-react';
import { ContentPlanItem } from '../types';
import { NICHES } from '../data/mockTemplates';

interface ContentPlannerViewProps {
  onGenerateFromIdea: (niche: string, prompt: string) => void;
  onBatchSchedule: (items: ContentPlanItem[]) => void;
}

export const ContentPlannerView: React.FC<ContentPlannerViewProps> = ({
  onGenerateFromIdea,
  onBatchSchedule,
}) => {
  const [selectedNiche, setSelectedNiche] = useState('Stoic Wisdom & Quotes');
  const [daysCount, setDaysCount] = useState<7 | 30>(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planItems, setPlanItems] = useState<ContentPlanItem[]>([]);

  // Default initial content plan items
  React.useEffect(() => {
    handleGeneratePlan();
  }, [selectedNiche, daysCount]);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/content-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: selectedNiche,
          days: daysCount,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate calendar plan');
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setPlanItems(data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>YouTube Shorts Editorial Strategy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI YouTube Shorts Content Planner
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Generate high-retention calendar strategies with researched YouTube hooks, viral retention scores, and 1-click batch creation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="btn-batch-schedule-plan"
            disabled={planItems.length === 0}
            onClick={() => onBatchSchedule(planItems)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Batch Schedule All {daysCount} Days</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-400 shrink-0">Niche:</label>
          <select
            id="select-planner-niche"
            value={selectedNiche}
            onChange={(e) => setSelectedNiche(e.target.value)}
            className="w-full md:w-64 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-rose-500"
          >
            {NICHES.map((n) => (
              <option key={n.id} value={n.name}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setDaysCount(7)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                daysCount === 7 ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7-Day Sprint
            </button>
            <button
              onClick={() => setDaysCount(30)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                daysCount === 30 ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30-Day Masterplan
            </button>
          </div>

          <button
            id="btn-regenerate-plan"
            disabled={isGenerating}
            onClick={handleGeneratePlan}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Regenerate Plan with Gemini"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin text-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Plan Items Grid */}
      {isGenerating ? (
        <div className="text-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto" />
          <div className="text-sm font-bold text-white">
            AI Researching Viral Hooks & Retention Calendar for {selectedNiche}...
          </div>
          <p className="text-xs text-slate-500">
            Analyzing trending YouTube Shorts engagement algorithms and peak retention hooks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {planItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl hover:shadow-rose-500/5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-extrabold">
                    Day {item.day || idx + 1}
                  </span>
                  <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{item.viralProbability || 94}% Viral Score</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2">
                    {item.topic}
                  </h3>
                  <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                    <span className="text-amber-400 font-bold">Hook: </span>
                    "{item.hook}"
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Angle:</span>
                    <span className="text-slate-300 font-medium">{item.angle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Call to Action:</span>
                    <span className="text-slate-300 font-medium">{item.cta}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Optimal: 6:30 PM</span>
                </div>

                <button
                  id={`btn-plan-create-${idx}`}
                  onClick={() => onGenerateFromIdea(selectedNiche, `${item.topic} - ${item.hook}`)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-rose-500/20 transition-all active:scale-95"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Create Video</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
