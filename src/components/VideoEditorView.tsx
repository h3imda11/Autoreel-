import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  RefreshCw,
  Trash2,
  Plus,
  Volume2,
  VolumeX,
  Sliders,
  Type,
  Share2,
  Download,
  Calendar,
  Layers,
  ChevronLeft,
  CheckCircle,
  Film,
  Music,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { VideoProject, VideoScene, CaptionStyle, VisualStyle } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { renderVideoProjectToBlob } from '../utils/videoRenderer';
import confetti from 'canvas-confetti';

interface VideoEditorViewProps {
  project: VideoProject;
  onBack: () => void;
  onSaveProject: (updated: VideoProject) => void;
  onPublishNow: (project: VideoProject) => void;
  onSchedulePost: (project: VideoProject) => void;
}

export const VideoEditorView: React.FC<VideoEditorViewProps> = ({
  project: initialProject,
  onBack,
  onSaveProject,
  onPublishNow,
  onSchedulePost,
}) => {
  const [project, setProject] = useState<VideoProject>(initialProject);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // Scene regeneration loading
  const [isRegeneratingScene, setIsRegeneratingScene] = useState(false);

  // Render & Export Modal
  const [isExporting, setIsExporting] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState('');
  const [renderedBlobUrl, setRenderedBlobUrl] = useState<string | null>(null);

  // Safe Zone overlay for YouTube Shorts UI
  const [showShortsOverlay, setShowShortsOverlay] = useState(true);

  const totalDuration = project.scenes.reduce((sum, s) => sum + s.duration, 0);

  // Find active scene based on currentTime
  let accumulatedTime = 0;
  let activeSceneIdx = 0;
  for (let i = 0; i < project.scenes.length; i++) {
    const sc = project.scenes[i];
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + sc.duration) {
      activeSceneIdx = i;
      break;
    }
    accumulatedTime += sc.duration;
  }
  const currentActiveScene = project.scenes[activeSceneIdx] || project.scenes[0];

  // Playback timer & audio orchestration
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      // Start background music loop
      const track = project.musicTrackId || 'music-dark-phonk';
      audioEngine.playMusicTrack(track, project.musicVolume ?? 0.3);

      const fps = 30;
      const stepSec = 1 / fps;

      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + stepSec;
          if (next >= totalDuration) {
            setIsPlaying(false);
            audioEngine.stopAll();
            return 0;
          }

          // Check if entering a new scene start to trigger SFX & narration
          let acc = 0;
          for (let i = 0; i < project.scenes.length; i++) {
            const sc = project.scenes[i];
            const sceneStart = acc;
            const sceneEnd = acc + sc.duration;

            // Trigger SFX at scene start
            if (prev < sceneStart + 0.05 && next >= sceneStart + 0.05 && sc.soundEffect) {
              audioEngine.playSoundEffect(sc.soundEffect);
            }

            // Trigger Narration
            if (prev < sceneStart + 0.1 && next >= sceneStart + 0.1 && sc.narration) {
              audioEngine.speakNarration(
                sc.narration,
                project.voiceEmotion || 'dramatic',
                1.0,
                (_word, charIdx) => {
                  // highlight word
                  setActiveWordIndex(charIdx);
                }
              );
            }

            acc = sceneEnd;
          }

          return next;
        });
      }, 1000 / fps);
    } else {
      audioEngine.stopAll();
    }

    return () => {
      if (interval) clearInterval(interval);
      audioEngine.stopAll();
    };
  }, [isPlaying, totalDuration, project]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioEngine.stopAll();
    } else {
      if (currentTime >= totalDuration) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(Math.max(0, Math.min(newTime, totalDuration)));
    audioEngine.stopAll();
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  // Scene editing helpers
  const handleUpdateScene = (index: number, partial: Partial<VideoScene>) => {
    const updatedScenes = [...project.scenes];
    updatedScenes[index] = { ...updatedScenes[index], ...partial };
    const updatedProj = { ...project, scenes: updatedScenes, updatedAt: new Date().toISOString() };
    setProject(updatedProj);
    onSaveProject(updatedProj);
  };

  const handleRegenerateScene = async (index: number) => {
    setIsRegeneratingScene(true);
    try {
      const targetScene = project.scenes[index];
      const res = await fetch('/api/gemini/regenerate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene: targetScene,
          topic: project.topic || project.title,
          visualStyle: project.visualStyle,
          language: project.language,
          modificationType: 'high retention punch',
        }),
      });

      if (!res.ok) throw new Error('Scene regeneration failed');
      const data = await res.json();
      if (data.success && data.scene) {
        handleUpdateScene(index, data.scene);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegeneratingScene(false);
    }
  };

  const handleAddScene = () => {
    const newScene: VideoScene = {
      id: `sc-${Date.now()}`,
      order: project.scenes.length + 1,
      duration: 6,
      narration: 'Add your powerful script line here for high viral impact.',
      visualPrompt: `Cinematic 9:16 vertical render in ${project.visualStyle} style`,
      visualUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      visualType: 'image',
      captionText: 'POWERFUL KEYWORD MOMENT',
      transition: 'fade',
      soundEffect: 'sfx-whoosh-fast',
      soundEffectTiming: 0.1,
    };
    const updated = { ...project, scenes: [...project.scenes, newScene] };
    setProject(updated);
    onSaveProject(updated);
    setSelectedSceneIndex(updated.scenes.length - 1);
  };

  const handleDeleteScene = (index: number) => {
    if (project.scenes.length <= 1) return;
    const updated = {
      ...project,
      scenes: project.scenes.filter((_, i) => i !== index),
    };
    setProject(updated);
    onSaveProject(updated);
    setSelectedSceneIndex(Math.max(0, index - 1));
  };

  // Full 1080x1920 MP4 Video Export
  const handleRenderFullVideo = async () => {
    setIsExporting(true);
    setRenderProgress(0);
    setRenderStage('Initializing high-definition 1080x1920 9:16 render pipeline...');
    setRenderedBlobUrl(null);

    try {
      const result = await renderVideoProjectToBlob(project, (pct, stage) => {
        setRenderProgress(pct);
        setRenderStage(stage);
      });

      setRenderedBlobUrl(result.url);
      setProject({ ...project, status: 'rendered', renderedVideoUrl: result.url });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
      setRenderStage('Rendering error. Please try again.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <button
            id="btn-editor-back"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            title="Back to Videos"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                {project.niche}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">
                {totalDuration}s total duration
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight line-clamp-1">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          <button
            id="btn-editor-toggle-safezone"
            onClick={() => setShowShortsOverlay(!showShortsOverlay)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              showShortsOverlay
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle YouTube Shorts Safe Zone overlay"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Shorts Safe Zone: {showShortsOverlay ? 'ON' : 'OFF'}</span>
          </button>

          <button
            id="btn-editor-schedule"
            onClick={() => onSchedulePost(project)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Schedule</span>
          </button>

          <button
            id="btn-editor-publish"
            onClick={() => onPublishNow(project)}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all active:scale-95 shadow-md shadow-red-600/20"
          >
            <Share2 className="w-4 h-4" />
            <span>Publish to YouTube</span>
          </button>

          <button
            id="btn-editor-render-export"
            onClick={handleRenderFullVideo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Render 1080x1920 MP4</span>
          </button>
        </div>
      </div>

      {/* Editor Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: 9:16 Vertical Video Preview Player (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl relative select-none flex flex-col justify-between group">
            {/* Background Visual Scene with Zoom Animation */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={
                  currentActiveScene.visualUrl ||
                  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80'
                }
                alt="Scene visual"
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isPlaying ? 'scale-110' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/60" />
            </div>

            {/* Top Bar: Brand Watermark & Sound Track */}
            <div className="relative z-10 p-4 flex items-center justify-between text-xs text-white">
              <div className="flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold text-[11px]">AutoReel</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800 text-[11px] text-slate-300">
                <Music className="w-3 h-3 text-cyan-400" />
                <span className="capitalize">{project.musicTrackId?.replace('music-', '') || 'Phonk'}</span>
              </div>
            </div>

            {/* Dynamic Captions Overlay */}
            <div className="relative z-10 px-4 text-center my-auto">
              <div className="inline-block p-3 rounded-2xl bg-black/60 backdrop-blur-sm border border-black/40 shadow-2xl">
                {project.captionStyle === 'hormozi-bold-glow' ? (
                  <div className="text-xl font-black text-amber-400 drop-shadow-[0_4px_14px_rgba(245,158,11,0.9)] tracking-wide leading-tight">
                    {currentActiveScene.captionText.toUpperCase()}
                  </div>
                ) : project.captionStyle === 'word-by-word-karaoke' ? (
                  <div className="text-lg font-extrabold text-cyan-400 tracking-wide">
                    {currentActiveScene.captionText.toUpperCase()}
                  </div>
                ) : project.captionStyle === 'cyber-neon' ? (
                  <div className="text-base font-mono font-bold text-rose-400 drop-shadow-[0_2px_10px_rgba(244,63,94,0.9)]">
                    {currentActiveScene.captionText.toUpperCase()}
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-white">
                    {currentActiveScene.captionText}
                  </div>
                )}
              </div>
            </div>

            {/* YouTube Shorts Native UI Overlay (Safe Zone Preview) */}
            {showShortsOverlay && (
              <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3">
                {/* Safe zone top margin boundary */}
                <div className="h-10 border-b border-dashed border-red-500/30 flex items-center justify-between px-2 text-[9px] text-red-400 font-mono">
                  <span>YouTube Shorts Top Safe Zone</span>
                  <span>9:16</span>
                </div>

                {/* Right side engagement buttons */}
                <div className="self-end flex flex-col items-center space-y-3.5 mr-1 mb-20">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-white shadow-lg">
                      <span className="text-xs">👍</span>
                    </div>
                    <span className="text-[9px] font-bold text-white mt-0.5 drop-shadow">48.2K</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-white shadow-lg">
                      <span className="text-xs">👎</span>
                    </div>
                    <span className="text-[9px] font-medium text-white mt-0.5 drop-shadow">Dislike</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-white shadow-lg">
                      <span className="text-xs">💬</span>
                    </div>
                    <span className="text-[9px] font-bold text-white mt-0.5 drop-shadow">612</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-white shadow-lg">
                      <span className="text-xs">↗️</span>
                    </div>
                    <span className="text-[9px] font-medium text-white mt-0.5 drop-shadow">Share</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-white shadow-lg">
                      <span className="text-xs">✂️</span>
                    </div>
                    <span className="text-[9px] font-medium text-white mt-0.5 drop-shadow">Remix</span>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-red-600/90 border border-white/40 flex items-center justify-center text-white shadow-lg animate-spin-slow">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom channel name & subscribe simulation */}
                <div className="absolute bottom-16 left-3 right-16 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-bold text-white">
                      Y
                    </div>
                    <span className="text-xs font-bold text-white drop-shadow">@AutoReelShorts</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-[9px] font-bold text-white">
                      Subscribe
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-200 line-clamp-1 font-medium drop-shadow">
                    {project.title}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Controls Overlay */}
            <div className="relative z-10 p-4 space-y-3 bg-gradient-to-t from-slate-950 to-transparent">
              {/* Timeline Scrubber Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold">
                  <span>{currentTime.toFixed(1)}s</span>
                  <span>{totalDuration}s</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={totalDuration}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  id="btn-editor-restart"
                  onClick={() => handleSeek(0)}
                  className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition-colors"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  id="btn-editor-play-pause"
                  onClick={handleTogglePlay}
                  className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded-md border border-slate-800">
                  Scene {activeSceneIdx + 1}/{project.scenes.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Scene Inspector & Timeline Editor (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Scene Selector Strip */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Film className="w-4 h-4 text-purple-400" />
                <span>Scene Timeline ({project.scenes.length} Scenes)</span>
              </h3>

              <button
                id="btn-add-scene"
                onClick={handleAddScene}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Scene</span>
              </button>
            </div>

            {/* Scene Thumbnails Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {project.scenes.map((sc, idx) => {
                const isSelected = selectedSceneIndex === idx;
                const isCurrentlyPlaying = activeSceneIdx === idx && isPlaying;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setSelectedSceneIndex(idx);
                      // Jump to scene start time
                      let acc = 0;
                      for (let i = 0; i < idx; i++) acc += project.scenes[i].duration;
                      handleSeek(acc);
                    }}
                    className={`relative rounded-xl overflow-hidden border p-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden relative mb-1.5">
                      <img
                        src={sc.visualUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {isCurrentlyPlaying && (
                        <div className="absolute inset-0 bg-rose-500/30 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono text-white font-bold">
                        {sc.duration}s
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-white truncate">
                      Scene #{idx + 1}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {sc.captionText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Scene Inspector Details */}
          {project.scenes[selectedSceneIndex] && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Editing Scene #{selectedSceneIndex + 1}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {project.scenes[selectedSceneIndex].duration}s duration
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    id="btn-regenerate-single-scene"
                    disabled={isRegeneratingScene}
                    onClick={() => handleRegenerateScene(selectedSceneIndex)}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingScene ? 'animate-spin' : ''}`} />
                    <span>AI Regenerate Scene</span>
                  </button>

                  {project.scenes.length > 1 && (
                    <button
                      id="btn-delete-scene"
                      onClick={() => handleDeleteScene(selectedSceneIndex)}
                      className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900/50 transition-colors"
                      title="Delete Scene"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Narration Script Text Editor */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Narration Voiceover Script (Spoken Text)
                </label>
                <textarea
                  rows={2}
                  value={project.scenes[selectedSceneIndex].narration}
                  onChange={(e) =>
                    handleUpdateScene(selectedSceneIndex, { narration: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Caption Text & Word Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    On-Screen Caption Text (Capitalized)
                  </label>
                  <input
                    type="text"
                    value={project.scenes[selectedSceneIndex].captionText}
                    onChange={(e) =>
                      handleUpdateScene(selectedSceneIndex, { captionText: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Scene Duration (Seconds)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={project.scenes[selectedSceneIndex].duration}
                      onChange={(e) =>
                        handleUpdateScene(selectedSceneIndex, {
                          duration: Math.max(2, parseInt(e.target.value) || 2),
                        })
                      }
                      className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-xs text-slate-400">sec</span>
                  </div>
                </div>
              </div>

              {/* Visual Prompt Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Visual Frame Prompt (9:16 Vertical Generation)
                </label>
                <textarea
                  rows={2}
                  value={project.scenes[selectedSceneIndex].visualPrompt}
                  onChange={(e) =>
                    handleUpdateScene(selectedSceneIndex, { visualPrompt: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              {/* Transition & Sound Effect Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Transition Effect
                  </label>
                  <select
                    value={project.scenes[selectedSceneIndex].transition}
                    onChange={(e) =>
                      handleUpdateScene(selectedSceneIndex, {
                        transition: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="zoom-in">Zoom In Smooth</option>
                    <option value="glitch">Cyber Glitch Flash</option>
                    <option value="fade">Cross Fade</option>
                    <option value="slide-left">Slide Left Fast</option>
                    <option value="dissolve">Dissolve</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Sound Effect (SFX Cue)
                  </label>
                  <select
                    value={project.scenes[selectedSceneIndex].soundEffect || 'none'}
                    onChange={(e) => {
                      const sfx = e.target.value === 'none' ? undefined : e.target.value;
                      handleUpdateScene(selectedSceneIndex, { soundEffect: sfx });
                      if (sfx) audioEngine.playSoundEffect(sfx);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="sfx-whoosh-fast">Fast Cinematic Whoosh</option>
                    <option value="sfx-bass-drop">Sub Heavy Bass Drop</option>
                    <option value="sfx-glitch-hit">Cyber Glitch Stutter</option>
                    <option value="sfx-cash-register">Cash Register Cha-Ching</option>
                    <option value="sfx-bell-ding">Sharp Attention Bell</option>
                    <option value="sfx-cinematic-riser">Tension Riser</option>
                    <option value="none">No SFX</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Audio Mixing Controls */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center space-x-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audio Mixing & Voice Ducking</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Narration Voice Volume</span>
                  <span className="font-mono">{Math.round((project.voiceVolume ?? 0.95) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={project.voiceVolume ?? 0.95}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    const updated = { ...project, voiceVolume: v };
                    setProject(updated);
                    onSaveProject(updated);
                    audioEngine.setVolumes(project.musicVolume ?? 0.3, v);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Background Music Volume</span>
                  <span className="font-mono">{Math.round((project.musicVolume ?? 0.3) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={project.musicVolume ?? 0.3}
                  onChange={(e) => {
                    const m = parseFloat(e.target.value);
                    const updated = { ...project, musicVolume: m };
                    setProject(updated);
                    onSaveProject(updated);
                    audioEngine.setVolumes(m, project.voiceVolume ?? 0.95);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export & Render Modal */}
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Film className="w-5 h-5 text-rose-500" />
                <span>9:16 Video Rendering Pipeline</span>
              </h3>
              <button
                onClick={() => setIsExporting(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Render Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-rose-400">{renderStage}</span>
                <span className="font-mono text-white text-sm">{renderProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
            </div>

            {/* If Rendered */}
            {renderedBlobUrl && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-4">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>1080x1920 MP4 Video Rendered Successfully!</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    id="btn-download-rendered-mp4"
                    href={renderedBlobUrl}
                    download={`${project.title.replace(/\s+/g, '_')}_9x16.mp4`}
                    className="flex-1 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download MP4 File</span>
                  </a>

                  <button
                    id="btn-modal-publish-now"
                    onClick={() => {
                      setIsExporting(false);
                      onPublishNow(project);
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Auto-Publish Post</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
