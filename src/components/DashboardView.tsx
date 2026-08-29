import React from 'react';
import {
  Sparkles,
  Play,
  TrendingUp,
  Eye,
  Video,
  Clock,
  Share2,
  Calendar,
  Zap,
  ArrowUpRight,
  Flame,
  CheckCircle,
  Film
} from 'lucide-react';
import { VideoProject, ScheduledPost } from '../types';
import { NICHES } from '../data/mockTemplates';

interface DashboardViewProps {
  videos: VideoProject[];
  schedules: ScheduledPost[];
  onNavigate: (page: string) => void;
  onSelectVideo: (video: VideoProject) => void;
  onQuickGenerate: (niche: string, prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  videos,
  schedules,
  onNavigate,
  onSelectVideo,
  onQuickGenerate,
}) => {
  const [quickTopic, setQuickTopic] = React.useState('');
  const [selectedNiche, setSelectedNiche] = React.useState('Stoic Wisdom & Quotes');

  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
  const totalLikes = videos.reduce((acc, v) => acc + (v.likes || 0), 0);
  const activeSchedules = schedules.filter(s => s.status === 'scheduled');

  const stats = [
    {
      id: 'stat-views',
      label: 'YouTube Shorts Views',
      value: totalViews ? `${(totalViews / 1000).toFixed(1)}K` : '142.5K',
      change: '+38.4% Shorts Feed',
      icon: Eye,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
    },
    {
      id: 'stat-videos',
      label: 'Shorts Generated',
      value: `${videos.length}`,
      change: '+12 this week',
      icon: Film,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'stat-scheduled',
      label: 'Upload Queue',
      value: `${activeSchedules.length} Scheduled`,
      change: 'Next peak slot in 4h',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'stat-engagement',
      label: 'Shorts Viewed vs Swiped',
      value: '78.4%',
      change: '+14.2% higher APV',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome & Quick Generator Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-3">
                <Flame className="w-3.5 h-3.5" />
                <span>YouTube Shorts Automation Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Turn Any Idea into a Viral YouTube Short in Seconds
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1.5 max-w-2xl">
                Research viral hooks, write retention scripts, generate AI voiceover, sync Hormozi captions, and auto-publish directly to your YouTube Shorts channels.
              </p>
            </div>

            <button
              id="btn-dash-create-custom"
              onClick={() => onNavigate('create')}
              className="shrink-0 flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-rose-500/25 transition-all active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>Open Studio Creator</span>
            </button>
          </div>

          {/* Quick Generate Input Box */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner flex flex-col sm:flex-row gap-3 items-center">
            <div className="w-full sm:w-64">
              <select
                id="select-dash-niche"
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
              >
                {NICHES.map((n) => (
                  <option key={n.id} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <input
              id="input-dash-quick-topic"
              type="text"
              placeholder="E.g., 3 mental tricks of Marcus Aurelius that stop overthinking..."
              value={quickTopic}
              onChange={(e) => setQuickTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (quickTopic || selectedNiche)) {
                  onQuickGenerate(selectedNiche, quickTopic);
                }
              }}
              className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />

            <button
              id="btn-dash-quick-generate"
              onClick={() => onQuickGenerate(selectedNiche, quickTopic)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Generate 1-Click Short</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`p-4 sm:p-5 rounded-2xl border ${stat.bg} backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                {stat.value}
              </div>
              <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Generated Videos & Upcoming Scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Videos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Film className="w-5 h-5 text-rose-400" />
              <span>Recent Video Projects</span>
            </h3>
            <button
              id="btn-view-all-videos"
              onClick={() => onNavigate('videos')}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
            >
              <span>View All ({videos.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.slice(0, 4).map((video) => (
              <div
                key={video.id}
                id={`card-video-${video.id}`}
                onClick={() => onSelectVideo(video)}
                className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:shadow-rose-500/5 flex flex-col"
              >
                {/* 9:16 Aspect Thumbnail Container */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img
                    src={video.thumbnailUrl || video.scenes[0]?.visualUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40">
                    <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/50 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-[11px] font-mono text-slate-200 font-semibold border border-slate-800">
                    {video.duration}s
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      video.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : video.status === 'scheduled'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">
                      {video.niche}
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-2 mt-0.5">
                      {video.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
                    <div className="flex items-center space-x-3">
                      {video.views ? (
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{(video.views / 1000).toFixed(1)}k</span>
                        </span>
                      ) : null}
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{video.viralScore || 92}% Score</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {video.scenes.length} scenes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Upcoming Scheduler & Trending Topics */}
        <div className="space-y-6">
          {/* Upcoming Schedule Queue */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Auto-Scheduler Queue</span>
              </h3>
              <button
                id="btn-view-scheduler"
                onClick={() => onNavigate('scheduler')}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-2.5">
              {schedules.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No scheduled posts yet.
                </div>
              ) : (
                schedules.slice(0, 3).map((sch) => (
                  <div
                    key={sch.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={sch.thumbnailUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white line-clamp-1">
                          {sch.projectTitle}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize mt-0.5 flex items-center space-x-1.5">
                          <span className="text-rose-400 font-bold uppercase">{sch.platform}</span>
                          <span>•</span>
                          <span>{new Date(sch.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      sch.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {sch.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              id="btn-dash-open-planner"
              onClick={() => onNavigate('planner')}
              className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Generate 7-Day Calendar</span>
            </button>
          </div>

          {/* Trending Faceless Niches Radar */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Trending Niches Radar</span>
            </h3>

            <div className="space-y-2">
              {NICHES.slice(0, 4).map((niche) => (
                <div
                  key={niche.id}
                  onClick={() => onQuickGenerate(niche.name, niche.hookPrompt)}
                  className="p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-rose-400 transition-colors">
                        {niche.name}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">
                        {niche.hookPrompt}
                      </div>
                    </div>
                  </div>
                  <Zap className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
