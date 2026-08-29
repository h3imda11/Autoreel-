import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  Search,
  Filter,
  Play,
  Share2,
  Calendar,
  Download,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  TrendingUp
} from 'lucide-react';
import { VideoProject, VideoStatus } from '../types';

interface MyVideosViewProps {
  videos: VideoProject[];
  onSelectVideo: (video: VideoProject) => void;
  onCreateNew: () => void;
  onPublishNow: (video: VideoProject) => void;
  onSchedulePost: (video: VideoProject) => void;
  onDeleteVideo: (id: string) => void;
}

export const MyVideosView: React.FC<MyVideosViewProps> = ({
  videos,
  onSelectVideo,
  onCreateNew,
  onPublishNow,
  onSchedulePost,
  onDeleteVideo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previewVideo, setPreviewVideo] = useState<VideoProject | null>(null);

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.niche.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Film className="w-7 h-7 text-red-500" />
            <span>My YouTube Shorts Library</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage, edit, publish and analyze your AI-generated YouTube Shorts projects.
          </p>
        </div>

        <button
          id="btn-myvideos-create-new"
          onClick={onCreateNew}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/20 transition-all active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Short</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title or niche..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['all', 'published', 'scheduled', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="text-base font-bold text-white">No videos found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Generate your first faceless short video using the AI Studio engine.
          </p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all"
          >
            Create Video Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              id={`video-card-${video.id}`}
              className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-rose-500/5"
            >
              <div>
                {/* 9:16 Aspect Thumbnail with Play Action */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img
                    src={
                      video.thumbnailUrl ||
                      video.scenes[0]?.visualUrl ||
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  {/* Play Button Overlay */}
                  <div
                    onClick={() => onSelectVideo(video)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/50 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono text-slate-200 font-semibold border border-slate-800">
                    {video.duration}s
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        video.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : video.status === 'scheduled'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {video.status}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2.5">
                  <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                    {video.niche}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                    {video.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    {video.views ? (
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{(video.views / 1000).toFixed(1)}k views</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      <span>{video.viralScore || 92}%</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-1">
                <button
                  onClick={() => onSelectVideo(video)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-purple-400" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onSchedulePost(video)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Schedule"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => onPublishNow(video)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Publish Now"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                </button>

                <button
                  onClick={() => onDeleteVideo(video.id)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete Video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
