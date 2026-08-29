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
  ExternalLink,
  ShieldCheck,
  LogIn,
  LogOut,
  User,
  Sliders
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  activePage: string;
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAuthModal?: () => void;
  onOpenAdminModal?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activePage,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  onOpenAuthModal,
  onOpenAdminModal,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
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

        {/* Free Access VIP Badge if active */}
        {user?.isFreeAccessUser && (
          <div className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Free VIP Access</span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        {/* Admin Hub Button if SuperAdmin */}
        {user?.role === 'admin' && onOpenAdminModal && (
          <button
            id="btn-header-admin-hub"
            onClick={onOpenAdminModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all text-xs font-bold shadow-sm"
            title="Open Admin Settings & Free Email Manager"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin Hub</span>
          </button>
        )}

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
            {user?.isFreeAccessUser ? '∞ Unlimited' : `${user?.creditsRemaining ?? 10} credits`}
          </span>
        </button>

        {/* Quick Create Video CTA */}
        {activePage !== 'create' && (
          <button
            id="btn-header-create-video"
            onClick={() => onNavigate('create')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Video</span>
          </button>
        )}

        {/* Dark/Light Mode Toggle */}
        <button
          id="btn-toggle-theme"
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="btn-header-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors relative"
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

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            id="btn-header-profile"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 pl-1"
            title="User Account"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt="User avatar"
              className="w-8 h-8 rounded-full ring-2 ring-rose-500/40 object-cover"
            />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2.5 border-b border-slate-800/80 mb-2">
                <div className="font-bold text-white text-sm truncate">{user?.name || 'Creator'}</div>
                <div className="text-xs text-slate-400 truncate">{user?.email || 'sachinmurali90@gmail.com'}</div>
                {user?.isFreeAccessUser && (
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                    100% Free VIP Access
                  </span>
                )}
              </div>

              <div className="space-y-1 text-xs">
                {user?.role === 'admin' && onOpenAdminModal && (
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenAdminModal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-amber-300 hover:bg-amber-500/10 flex items-center space-x-2 transition-colors"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Admin Settings & Emails</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onNavigate('settings');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Account & YouTube Settings</span>
                </button>

                {onOpenAuthModal && (
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenAuthModal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 flex items-center space-x-2 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Switch Account / Sign In</span>
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 flex items-center space-x-2 transition-colors border-t border-slate-800/80 pt-2 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
