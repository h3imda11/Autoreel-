import React, { useState } from 'react';
import {
  Clock,
  Calendar as CalendarIcon,
  Share2,
  CheckCircle,
  AlertCircle,
  Trash2,
  Play,
  ArrowRight,
  Filter,
  Plus,
  RefreshCw
} from 'lucide-react';
import { ScheduledPost, VideoProject } from '../types';

interface SchedulerViewProps {
  schedules: ScheduledPost[];
  videos: VideoProject[];
  onTriggerPublish: (id: string) => void;
  onCancelSchedule: (id: string) => void;
  onNavigateToCreate: () => void;
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({
  schedules,
  videos,
  onTriggerPublish,
  onCancelSchedule,
  onNavigateToCreate,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'scheduled' | 'published'>('all');

  const filtered = schedules.filter((s) => {
    return selectedStatusFilter === 'all' || s.status === selectedStatusFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>YouTube Shorts Auto-Publish Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            YouTube Shorts Scheduler & Calendar
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Automated scheduling directly to your connected YouTube Shorts channel at peak audience retention hours.
          </p>
        </div>

        <button
          id="btn-scheduler-schedule-new"
          onClick={onNavigateToCreate}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Short</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2">
          {(['all', 'scheduled', 'published'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedStatusFilter === status
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {status === 'all' ? 'All Queue' : status}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            Queue List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              viewMode === 'calendar' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            Calendar Grid
          </button>
        </div>
      </div>

      {/* List or Calendar View */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <Clock className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="text-base font-bold text-white">No scheduled posts</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Schedule your rendered videos to automatically publish to social platforms at optimal audience hours.
          </p>
          <button
            onClick={onNavigateToCreate}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all"
          >
            Create & Schedule Video
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          {filtered.map((sch) => (
            <div
              key={sch.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={
                    sch.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80'
                  }
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">
                      {sch.platform}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(sch.scheduledTime).toLocaleDateString()} at{' '}
                      {new Date(sch.scheduledTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">
                    {sch.projectTitle}
                  </h3>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {sch.caption}
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center space-x-3 self-end sm:self-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    sch.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : sch.status === 'scheduled'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {sch.status}
                </span>

                {sch.status === 'scheduled' && (
                  <button
                    onClick={() => onTriggerPublish(sch.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center space-x-1 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>
                )}

                <button
                  onClick={() => onCancelSchedule(sch.id)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors"
                  title="Cancel Schedule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Calendar 7-Day Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
            (day, dIdx) => {
              const daySchedules = filtered.filter((_, i) => i % 7 === dIdx);
              return (
                <div key={day} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-200">{day}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {daySchedules.length} posts
                    </span>
                  </div>

                  <div className="space-y-2">
                    {daySchedules.length === 0 ? (
                      <div className="text-[11px] text-slate-600 py-4 text-center">
                        No posts scheduled
                      </div>
                    ) : (
                      daySchedules.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase text-rose-400">
                              {item.platform}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              6:00 PM
                            </span>
                          </div>
                          <div className="font-semibold text-white truncate">
                            {item.projectTitle}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};
