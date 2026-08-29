import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Film,
  CalendarDays,
  Clock,
  Share2,
  Layers,
  Mic,
  Music,
  BarChart3,
  Settings,
  CreditCard,
  Video,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: '' },
    { id: 'create', label: 'Create Shorts', icon: Sparkles, badge: 'AI Engine', highlight: true },
    { id: 'videos', label: 'Shorts Library', icon: Film, badge: '' },
    { id: 'planner', label: 'Shorts Planner', icon: CalendarDays, badge: 'Viral' },
    { id: 'scheduler', label: 'Upload Queue', icon: Clock, badge: '' },
    { id: 'social', label: 'YouTube Channels', icon: Share2, badge: 'OAuth' },
  ];

  const creativeTools = [
    { id: 'templates', label: 'Templates', icon: Layers, badge: 'Trending' },
    { id: 'voices', label: 'Voice Studio', icon: Mic, badge: 'TTS' },
    { id: 'music', label: 'Music & SFX', icon: Music, badge: 'Free' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: '' },
  ];

  const accountItems = [
    { id: 'settings', label: 'Settings & APIs', icon: Settings, badge: '' },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard, badge: 'Pro' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <button
            id="btn-sidebar-logo"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-3 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-rose-400">
                <Video className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AutoReel AI
              </div>
              <div className="text-[11px] text-red-400 font-medium">
                YouTube Shorts Studio
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6">
          {/* Main Workflows */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Core Engine
            </div>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-500/20 to-purple-500/10 border border-rose-500/30 text-white font-semibold shadow-sm'
                        : item.highlight
                        ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : ''}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        isActive 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Creative Tools */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Studio & Assets
            </div>
            <div className="space-y-1">
              {creativeTools.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-500/20 to-purple-500/10 border border-rose-500/30 text-white font-semibold'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : ''}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-400 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings & Admin */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Management
            </div>
            <div className="space-y-1">
              {accountItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-500/20 to-purple-500/10 border border-rose-500/30 text-white font-semibold'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : ''}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-3 border-t border-slate-800/60 m-3 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>YouTube Data API v3</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
            Connected
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Automated faceless publishing directly to YouTube Shorts channels.
        </p>
      </div>
    </aside>
  );
};
