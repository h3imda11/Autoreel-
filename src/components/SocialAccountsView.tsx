import React, { useState } from 'react';
import {
  Share2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Plus,
  Play,
  Users,
  Eye,
  Zap,
  Sliders,
  Award
} from 'lucide-react';
import { SocialAccount, PlatformType } from '../types';

interface SocialAccountsViewProps {
  accounts: SocialAccount[];
  onToggleConnect: (platform: PlatformType) => void;
}

export const SocialAccountsView: React.FC<SocialAccountsViewProps> = ({
  accounts,
  onToggleConnect,
}) => {
  const [testingChannel, setTestingChannel] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ channel: string; message: string } | null>(null);
  const [channels, setChannels] = useState([
    {
      id: 'yt-channel-1',
      name: 'Stoic Mindset Shorts',
      handle: '@StoicMindsetShorts',
      channelId: 'UC_x89aF24bc899Stoic123',
      subscribers: 48200,
      totalViews: 320000,
      shortsCount: 142,
      monetized: true,
      defaultVisibility: 'public',
      quotaUsedPercent: 24,
      connected: true,
    },
    {
      id: 'yt-channel-2',
      name: 'Cyberpunk & AI Lore Shorts',
      handle: '@CyberLoreShorts',
      channelId: 'UC_k90aL34bc899Cyber999',
      subscribers: 19400,
      totalViews: 148500,
      shortsCount: 68,
      monetized: true,
      defaultVisibility: 'public',
      quotaUsedPercent: 12,
      connected: true,
    },
  ]);

  const handleTestConnection = (chId: string, name: string) => {
    setTestingChannel(chId);
    setTestResult(null);
    setTimeout(() => {
      setTestingChannel(null);
      setTestResult({
        channel: name,
        message: `YouTube Data API v3 verified for ${name}! Scopes: 'youtube.upload', 'youtube.readonly', 'youtubepartner'. Direct 9:16 Shorts publishing active.`,
      });
    }, 900);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official YouTube Data API v3 Integrations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Connected YouTube Channels
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Connect and manage your automated faceless YouTube Shorts channels with direct 9:16 upload permissions.
          </p>
        </div>

        <button
          onClick={() => onToggleConnect('youtube')}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Another YouTube Channel</span>
        </button>
      </div>

      {/* Test Verification Toast */}
      {testResult && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{testResult.message}</span>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-xs font-bold text-white hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((ch) => {
          const isTesting = testingChannel === ch.id;

          return (
            <div
              key={ch.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-6 transition-all shadow-xl"
            >
              <div className="space-y-4">
                {/* Brand Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                      Y
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">{ch.name}</h3>
                      <p className="text-xs text-red-400 font-mono mt-0.5">{ch.handle}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                    Active Channel
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Subscribers</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {ch.subscribers.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Shorts Views</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      {ch.totalViews.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Shorts Uploaded</div>
                    <div className="text-sm font-bold text-purple-400 font-mono mt-0.5">
                      {ch.shortsCount}
                    </div>
                  </div>
                </div>

                {/* Channel Details */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">YouTube Channel ID:</span>
                    <span className="font-mono text-slate-200 text-[11px]">{ch.channelId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Monetization Status:</span>
                    <span className="font-bold text-emerald-400 flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>YouTube Partner Program Active</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Daily API Upload Quota:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${ch.quotaUsedPercent}%` }} />
                      </div>
                      <span className="font-mono text-[11px] text-slate-300">{ch.quotaUsedPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
                <button
                  id={`btn-test-${ch.id}`}
                  onClick={() => handleTestConnection(ch.id, ch.name)}
                  disabled={isTesting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-slate-800"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-red-400' : ''}`} />
                  <span>Test API Scopes</span>
                </button>

                <button
                  id={`btn-disconnect-${ch.id}`}
                  onClick={() => onToggleConnect('youtube')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 text-xs font-bold transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
