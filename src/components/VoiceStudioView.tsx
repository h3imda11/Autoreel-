import React, { useState } from 'react';
import {
  Mic,
  Play,
  Pause,
  Sparkles,
  Volume2,
  VolumeX,
  Sliders,
  CheckCircle,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import { VOICE_PRESETS } from '../data/mockTemplates';
import { VoiceEmotion } from '../types';
import { audioEngine } from '../utils/audioEngine';

export const VoiceStudioView: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PRESETS[0]);
  const [selectedEmotion, setSelectedEmotion] = useState<VoiceEmotion>('dramatic');
  const [testText, setTestText] = useState(
    'Most people scroll all day waiting for a sign. This is your wake-up call to master discipline.'
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);

  const emotions: { id: VoiceEmotion; label: string; desc: string }[] = [
    { id: 'dramatic', label: 'Dramatic & Deep', desc: 'Epic cinematic stoicism and mysteries' },
    { id: 'motivational', label: 'High Motivation', desc: 'High energy mindset and fitness hooks' },
    { id: 'energetic', label: 'Viral & Energetic', desc: 'Fast-paced tech and pop facts' },
    { id: 'mysterious', label: 'Dark / Eerie', desc: 'True crime and conspiracy thrillers' },
    { id: 'chill', label: 'Chill & Relaxed', desc: 'Lo-fi advice and soothing meditation' },
    { id: 'authoritative', label: 'Authoritative', desc: 'Finance and business breakdowns' },
    { id: 'storyteller', label: 'Wise Storyteller', desc: 'Historical epics and folk legends' },
  ];

  const handleTestPlay = () => {
    if (isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioEngine.speakNarration(
        testText,
        selectedEmotion,
        speechRate,
        undefined,
        () => setIsPlaying(false)
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
          <Mic className="w-3.5 h-3.5" />
          <span>Hyperrealistic AI Voice Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Voice Studio
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Audition, calibrate emotion, and fine-tune voiceovers for your faceless channel persona.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Voice Profiles List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Select Voice Character</h3>
          <div className="space-y-2.5">
            {VOICE_PRESETS.map((v) => {
              const isSelected = selectedVoice.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVoice(v)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-rose-500/10 border-rose-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-400 font-bold text-sm">
                      {v.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold flex items-center space-x-2">
                        <span>{v.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                          {v.gender}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {v.accent} • {v.style}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Interactive Speech Playground */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Voice Playground: {selectedVoice.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Natural AI speech synthesis with zero robotic artifacts.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                TTS Ready
              </span>
            </div>

            {/* Tone & Emotion Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Select Emotion & Tone Pacing
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {emotions.map((em) => (
                  <button
                    key={em.id}
                    type="button"
                    onClick={() => setSelectedEmotion(em.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      selectedEmotion === em.id
                        ? 'bg-purple-500/20 border-purple-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate">{em.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Script Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Sample Test Script
              </label>
              <textarea
                rows={3}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Speed Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Pacing / Speed</span>
                  <span className="font-mono text-white">{speechRate}x</span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.5}
                  step={0.05}
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Pitch Resonance</span>
                  <span className="font-mono text-white">{speechPitch}x</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={1.2}
                  step={0.05}
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* Play Button & Waveform Indicator */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  id="btn-voice-studio-play"
                  onClick={handleTestPlay}
                  className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <div>
                  <div className="text-xs font-bold text-white">
                    {isPlaying ? 'Auditioning Voice...' : 'Click to Audition Audio'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {selectedVoice.name} • {selectedEmotion.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Animated Waveform bars if playing */}
              <div className="flex items-center space-x-1">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-rose-500 rounded-full transition-all duration-150 ${
                      isPlaying ? 'h-6 animate-pulse' : 'h-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
