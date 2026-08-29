import React, { useState } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Zap,
  Disc,
  Radio,
  Sliders,
  CheckCircle
} from 'lucide-react';
import { MUSIC_TRACKS } from '../data/mockTemplates';
import { audioEngine } from '../utils/audioEngine';

export const MusicLibraryView: React.FC = () => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [activeSfx, setActiveSfx] = useState<string | null>(null);

  const sfxList = [
    { id: 'sfx-whoosh-fast', name: 'Fast Whoosh', tag: 'Transition', desc: 'High-speed cinematic camera whip' },
    { id: 'sfx-bass-drop', name: 'Heavy Bass Drop', tag: 'Hook / Drop', desc: 'Sub-bass impact on hook' },
    { id: 'sfx-glitch-hit', name: 'Cyber Glitch', tag: 'Text Popup', desc: 'Futuristic digital stutter' },
    { id: 'sfx-cash-register', name: 'Cha-Ching Cash', tag: 'Finance', desc: 'Money sound for wealth hooks' },
    { id: 'sfx-bell-ding', name: 'Attention Bell', tag: 'Keyword', desc: 'Clean bell ding for mind-blowing fact' },
    { id: 'sfx-cinematic-riser', name: 'Tension Riser', tag: 'Suspense', desc: 'Ascending tension buildup' },
  ];

  const handleToggleMusic = (track: typeof MUSIC_TRACKS[0]) => {
    if (playingTrackId === track.id) {
      audioEngine.stopMusic();
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(track.id);
      audioEngine.playMusicTrack(track.mood, 0.4);
    }
  };

  const handlePlaySfx = (sfxId: string) => {
    setActiveSfx(sfxId);
    audioEngine.playSoundEffect(sfxId);
    setTimeout(() => setActiveSfx(null), 500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <Music className="w-3.5 h-3.5" />
          <span>Royalty-Free Audio Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Music & Sound FX Library
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          High-energy viral background tracks & cinematic sound effects for retention pacing. 100% monetization safe.
        </p>
      </div>

      {/* Two Column Layout: Music Tracks & SFX Soundboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Background Music Tracks */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Disc className="w-4 h-4 text-rose-500" />
              <span>Background Tracks by Mood</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {MUSIC_TRACKS.length} Tracks Available
            </span>
          </div>

          <div className="space-y-3">
            {MUSIC_TRACKS.map((track) => {
              const isPlaying = playingTrackId === track.id;
              return (
                <div
                  key={track.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isPlaying
                      ? 'bg-rose-500/10 border-rose-500/80 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <button
                      id={`btn-play-music-${track.id}`}
                      onClick={() => handleToggleMusic(track)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isPlaying
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <div>
                      <div className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>{track.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                          {track.mood}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {track.bpm} BPM • {track.genre}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-slate-500">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: SFX Soundboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Retention SFX Soundboard</span>
            </h3>
            <span className="text-xs text-slate-500">Interactive Cues</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sfxList.map((sfx) => {
              const isActive = activeSfx === sfx.id;
              return (
                <div
                  key={sfx.id}
                  onClick={() => handlePlaySfx(sfx.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isActive
                      ? 'bg-amber-500/20 border-amber-500 scale-95 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold uppercase">
                      {sfx.tag}
                    </span>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-white">{sfx.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {sfx.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
