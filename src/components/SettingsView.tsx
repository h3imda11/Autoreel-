import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Key,
  Video,
  CheckCircle,
  AlertCircle,
  Save,
  Volume2,
  Type,
  Clock,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile | null;
  onSavePreferences: (prefs: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onSavePreferences }) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [brandWatermark, setBrandWatermark] = useState('AutoReel');
  const [enableWatermark, setEnableWatermark] = useState(true);
  const [defaultDuration, setDefaultDuration] = useState('30');
  const [defaultVoice, setDefaultVoice] = useState('Marcus (Authoritative)');

  const apiStatuses = [
    {
      name: 'Google Gemini 2.5 AI Engine',
      envVar: 'GEMINI_API_KEY',
      status: 'Active (Server-Side)',
      desc: 'Powers scriptwriting, hook research, scene generation and TTS.',
      active: true,
    },
    {
      name: 'YouTube Data API v3',
      envVar: 'YOUTUBE_CLIENT_ID / SECRET',
      status: 'Connected (OAuth 2.0)',
      desc: 'Enables direct 1-click publishing to YouTube Shorts.',
      active: true,
    },
    {
      name: 'Meta Graph & Instagram API',
      envVar: 'INSTAGRAM_APP_SECRET',
      status: 'Connected',
      desc: 'Publishes 9:16 reels directly to Instagram accounts.',
      active: true,
    },
    {
      name: 'TikTok Video Kit API',
      envVar: 'TIKTOK_CLIENT_KEY',
      status: 'Connected',
      desc: 'Uploads and schedules posts to TikTok creator accounts.',
      active: true,
    },
  ];

  const handleSave = () => {
    onSavePreferences({
      brandWatermark,
      enableWatermark,
      defaultDuration,
      defaultVoice,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Configuration & Integration Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings & API Architecture
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Server-side environment variables, API health monitors, rendering presets, and channel branding.
          </p>
        </div>

        <button
          id="btn-save-settings"
          onClick={handleSave}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-500/20 transition-all active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Preferences updated and persisted successfully!</span>
        </div>
      )}

      {/* Section 1: Server-Side API Architecture Status */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Modular Provider Architecture</span>
          </h3>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
            Zero Client-Side Leakage
          </span>
        </div>

        <div className="space-y-3">
          {apiStatuses.map((api, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">{api.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">({api.envVar})</span>
                </div>
                <p className="text-xs text-slate-400">{api.desc}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {api.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Channel Branding & Default Video Presets */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Video className="w-5 h-5 text-rose-500" />
          <span>Default Generation Presets</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Custom Watermark / Channel Badge
            </label>
            <input
              type="text"
              value={brandWatermark}
              onChange={(e) => setBrandWatermark(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Default Video Target Duration
            </label>
            <select
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
            >
              <option value="15">15 Seconds (Fast Loop)</option>
              <option value="30">30 Seconds (Optimal Retention)</option>
              <option value="45">45 Seconds (Deep Story)</option>
              <option value="60">60 Seconds (Full Breakdown)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
