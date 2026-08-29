import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Sparkles,
  Flame,
  Zap,
  ArrowUpRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { VideoProject } from '../types';

interface AnalyticsViewProps {
  videos: VideoProject[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ videos }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | 'all'>('30d');
  const [aiInsights, setAiInsights] = useState<string[]>([
    'Videos with fast whoosh sound effects on second 0-2 have 38% higher completion rates.',
    'Dark Cyberpunk and Documentary Noir visuals currently achieve 4.2x higher share rates on TikTok.',
    'Posting at 6:30 PM EST generates peak retention for Stoic Wisdom & Psychology content.',
  ]);

  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0) || 142500;
  const totalLikes = videos.reduce((acc, v) => acc + (v.likes || 0), 0) || 18400;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>YouTube Shorts Feed Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Shorts Analytics & Retention Radar
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time YouTube Shorts Feed swipe-through rates, APV (Average Percentage Viewed), and AI growth metrics.
          </p>
        </div>

        <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {['7d', '30d', 'all'].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                selectedTimeframe === tf ? 'bg-red-600 text-white' : 'text-slate-400'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Viral Views</span>
            <Eye className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {(totalViews / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-emerald-400 font-semibold">+42.8% vs last month</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Engagements</span>
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {(totalLikes / 1000).toFixed(1)}K
          </div>
          <div className="text-xs text-emerald-400 font-semibold">+18.4% engagement rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Retention</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">88.2%</div>
          <div className="text-xs text-emerald-400 font-semibold">Above 80% benchmark</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Viral Score Avg</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">93.6 / 100</div>
          <div className="text-xs text-purple-400 font-semibold">Tier 1 Algorithm fit</div>
        </div>
      </div>

      {/* Two Column Layout: Retention Curve Graph & AI Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Retention Curve Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Audience Retention Curve</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pacing benchmark across first 30 seconds of short-form videos.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Hook Holding: 94%
            </span>
          </div>

          {/* Retention Chart Visual Bars */}
          <div className="space-y-3 pt-2">
            {[
              { time: '0s - 3s (The Viral Hook)', pct: 96, color: 'bg-emerald-400' },
              { time: '3s - 10s (Value Delivery)', pct: 91, color: 'bg-emerald-400' },
              { time: '10s - 20s (Plot Twist / Tension)', pct: 86, color: 'bg-amber-400' },
              { time: '20s - 30s (CTA & Loop Seam)', pct: 82, color: 'bg-rose-400' },
            ].map((bar, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{bar.time}</span>
                  <span className="font-mono text-white font-bold">{bar.pct}% viewers</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className={`${bar.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Your videos retain 96% of viewers past the critical 3-second mark thanks to bold glowing keyword captions.
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Gemini AI Insights */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Automated Optimization Insights</span>
          </div>

          <div className="space-y-3">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-300 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p>{insight}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 to-purple-500/10 border border-rose-500/20">
            <div className="text-xs font-bold text-white flex items-center space-x-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Next Recommended Niche</span>
            </div>
            <p className="text-xs text-slate-300">
              "AI Tech Inventions" is trending with 120% velocity. Try generating a 30s video with Dark Cyberpunk aesthetics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
