import React, { useState } from 'react';
import {
  Share2,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { VideoProject, PlatformType } from '../types';
import confetti from 'canvas-confetti';

interface PublishModalProps {
  video: VideoProject | null;
  mode: 'publish' | 'schedule';
  onClose: () => void;
  onConfirmPublish: (video: VideoProject, platforms: PlatformType[]) => void;
  onConfirmSchedule: (video: VideoProject, platforms: PlatformType[], scheduledTime: string) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  video,
  mode,
  onClose,
  onConfirmPublish,
  onConfirmSchedule,
}) => {
  if (!video) return null;

  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [scheduledTime, setScheduledTime] = useState(
    new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(
    video.title.includes('#Shorts') ? video.title : `${video.title} #Shorts`
  );
  const [description, setDescription] = useState(video.description);

  const handleAction = () => {
    setIsSubmitting(true);
    const updated: VideoProject = {
      ...video,
      title,
      description,
      targetPlatforms: ['youtube'],
      visibility,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'publish') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        onConfirmPublish(updated, ['youtube']);
      } else {
        onConfirmSchedule(updated, ['youtube'], scheduledTime);
      }
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              {mode === 'publish' ? <Share2 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'publish' ? 'Publish to YouTube Shorts' : 'Schedule YouTube Short'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'publish' ? 'Upload directly via YouTube Data API v3' : 'Queued for optimal peak Shorts feed traffic'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Summary Card */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-3.5">
          <img
            src={video.thumbnailUrl || video.scenes[0]?.visualUrl || ''}
            alt=""
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{video.title}</div>
            <div className="text-[11px] text-red-400 font-semibold">{video.niche} • {video.duration}s</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              {video.scenes.length} Scenes • 1080x1920 9:16 Vertical HD
            </div>
          </div>
        </div>

        {/* YouTube Channel Destination */}
        <div className="p-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
              Y
            </div>
            <div>
              <div className="text-xs font-bold text-white">@StoicMindsetShorts</div>
              <div className="text-[10px] text-slate-400">YouTube Partner Account</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            Connected
          </span>
        </div>

        {/* Post Title & Description Customization */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              YouTube Shorts Title (Includes #Shorts)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Audience
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
                Not made for kids
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Description & Tags
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Schedule Time Input if Schedule mode */}
        {mode === 'schedule' && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              Scheduled Date & Time (Recommended Peak: 6:30 PM)
            </label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
        )}

        {/* Confirmation Button */}
        <div className="pt-2">
          <button
            id="btn-confirm-publish-modal"
            disabled={isSubmitting}
            onClick={handleAction}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {mode === 'publish' ? (
              <>
                <Share2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Uploading to YouTube Shorts...' : 'Publish to YouTube Shorts'}</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>{isSubmitting ? 'Adding to YouTube Queue...' : 'Confirm Scheduled YouTube Upload'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
