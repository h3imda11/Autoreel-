import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Bell, 
  Moon, 
  Sun, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  activePage: string;
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activePage,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    {
      id: 'notif-1',
      title: 'YouTube Short Published',
      message: '"3 Stoic Rules That Destroy Anxiety" reached 142.5K views on YouTube Shorts!',
      time: '2 hours ago',
      type: 'success',
      icon: CheckCircle2,
    },
    {
      id: 'notif-2',
      title: 'YouTube Scheduled Queue Ready',
      message: 'AI Tech Inventions Short scheduled for peak 6:30 PM YouTube traffic.',
      time: '5 hours ago',
      type: 'info',
      icon: Clock,
    },
    {
      id: 'notif-3',
      title: 'YouTube Shorts Planner',
      message: 'Your 7-day Stoic Wisdom YouTube Shorts calendar is ready with viral tags.',
      time: '1 day ago',
      type: 'sparkle',
      icon: Sparkles,
    }
  ]);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
      {/* Left Title / Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          id="btn-header-logo-mobile"
          onClick={() => onNavigate('dashboard')}
          className="lg:hidden flex items-center space-x-2 font-bold text-lg bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Video className="w-4 h-4" />
          </div>
          <span>AutoReel</span>
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-sm">
          <span className="text-slate-500">AutoReel AI</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-medium capitalize">
            {activePage.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Credits Balance Pill */}
        <button
          id="btn-credits-pill"
          onClick={() => onNavigate('billing')}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs text-slate-300 group"
          title="Click to manage video credits"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-white">
            {user?.creditsRemaining ?? 48}
          </span>
          <span className="text-slate-500 hidden sm:inline">
            / {user?.creditsTotal ?? 60} credits
          </span>
        </button>

        {/* Quick Create Video CTA */}
        {activePage !== 'create' && (
          <button
            id="btn-header-create-video"
            onClick={() => onNavigate('create')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Video</span>
          </button>
        )}

        {/* Dark/Light Mode Toggle */}
        <button
          id="btn-toggle-theme"
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-header-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <span>Notifications</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs">
                    3 New
                  </span>
                </h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/50 border border-slate-800/50 transition-colors flex items-start space-x-3 cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-slate-900 text-rose-400 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-200">
                          {notif.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {notif.message}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          {notif.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          id="btn-header-profile"
          onClick={() => onNavigate('settings')}
          className="flex items-center space-x-2.5 pl-1"
          title="Account Settings"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt="User avatar"
            className="w-8 h-8 rounded-full ring-2 ring-rose-500/40 object-cover"
          />
        </button>
      </div>
    </header>
  );
};
