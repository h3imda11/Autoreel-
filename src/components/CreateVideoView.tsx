import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Volume2,
  Clock,
  Globe,
  Palette,
  Type,
  Music,
  CheckCircle2,
  Layers,
  ArrowRight,
  RefreshCw,
  Flame,
  ShieldCheck,
  Check,
  Play,
  Share2,
  Sliders,
  SlidersHorizontal,
  FileText,
  BookOpen,
  Eye,
  Smile,
  AlertTriangle,
  Heart,
  HelpCircle
} from 'lucide-react';
import {
  DurationOption,
  VisualStyle,
  CaptionStyle,
  MusicMood,
  VoiceEmotion,
  VideoProject,
  GenerationProgressState,
  VoiceSettings
} from '../types';
import { NICHES, LANGUAGES, MUSIC_TRACKS } from '../data/mockTemplates';
import { VIDEO_STYLES, NATURAL_VOICES, VOICE_EMOTIONS, VOICE_STYLES } from '../data/voices';
import { audioEngine } from '../utils/audioEngine';

interface CreateVideoViewProps {
  initialNiche?: string;
  initialPrompt?: string;
  onVideoCreated: (video: VideoProject) => void;
  isFreeAccessUser?: boolean;
}

export const CreateVideoView: React.FC<CreateVideoViewProps> = ({
  initialNiche = 'Stoic Wisdom & Quotes',
  initialPrompt = '',
  onVideoCreated,
  isFreeAccessUser = false,
}) => {
  // Topic & Style References
  const [niche, setNiche] = useState(initialNiche);
  const [topicPrompt, setTopicPrompt] = useState(initialPrompt);
  const [styleReference, setStyleReference] = useState('');
  const [customStylePrompt, setCustomStylePrompt] = useState('');

  // Duration & Language
  const [duration, setDuration] = useState<DurationOption>(30);
  const [language, setLanguage] = useState('en');

  // Visual & Caption Styles
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('realistic-cinematic');
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('hormozi-bold-glow');
  const [musicMood, setMusicMood] = useState<MusicMood>('dark-phonk');
  const [youtubeCategory, setYoutubeCategory] = useState<string>('Education');
  const [includeShortsTag, setIncludeShortsTag] = useState(true);

  // Expressive Voice Studio Settings
  const [selectedVoiceId, setSelectedVoiceId] = useState('voice-marcus');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('male');
  const [voiceEmotion, setVoiceEmotion] = useState<VoiceEmotion>('dramatic');
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1.0);
  const [voicePitch, setVoicePitch] = useState<number>(0);
  const [voiceSelectedStyle, setVoiceSelectedStyle] = useState<string>('Cinematic Blockbuster Narrator');

  // Generation Pipeline State
  const [progressState, setProgressState] = useState<GenerationProgressState>('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStageText, setCurrentStageText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [auditioningVoice, setAuditioningVoice] = useState<string | null>(null);

  const captionStyles: { id: CaptionStyle; name: string; sample: string; previewClass: string }[] = [
    {
      id: 'hormozi-bold-glow',
      name: 'Hormozi Glow',
      sample: 'DO NOT IGNORE THIS',
      previewClass: 'font-black text-amber-400 drop-shadow-[0_4px_16px_rgba(245,158,11,0.8)] border-2 border-black/60 bg-black/40',
    },
    {
      id: 'word-by-word-karaoke',
      name: 'Karaoke Active Pulse',
      sample: 'ONE SINGLE WORD',
      previewClass: 'font-extrabold text-cyan-400 bg-black/80 shadow-lg border border-cyan-500/40',
    },
    {
      id: 'cyber-neon',
      name: 'Cyber Neon Sub',
      sample: 'SECRET ACCESS GRANTED',
      previewClass: 'font-mono font-bold text-rose-400 drop-shadow-[0_2px_12px_rgba(244,63,94,0.9)] bg-slate-950/80',
    },
    {
      id: 'minimal-clean',
      name: 'Minimal Clean Box',
      sample: 'Timeless wisdom for focus',
      previewClass: 'font-medium text-slate-100 bg-slate-900/90 border border-slate-700',
    },
  ];

  const handleAuditionVoice = (voice: typeof NATURAL_VOICES[0]) => {
    setAuditioningVoice(voice.id);
    const sampleText = `Hello creator! This is ${voice.name}. Mastering viral tension and emotional pacing starts with the right voice delivery.`;
    audioEngine.speakNarration(sampleText, voice.tone, voiceSpeed, undefined, () => {
      setAuditioningVoice(null);
    });
  };

  const handleStartGeneration = async () => {
    setProgressState('researching');
    setProgressPercent(10);
    setCurrentStageText('Analyzing Story & Narrative Arc with AI Story Engine...');
    setErrorMessage('');

    try {
      const selectedVoice = NATURAL_VOICES.find(v => v.id === selectedVoiceId) || NATURAL_VOICES[0];
      const voiceSettings: VoiceSettings = {
        gender: voiceGender,
        accent: selectedVoice.accent,
        language: selectedVoice.language,
        speed: voiceSpeed,
        pitch: voicePitch,
        emotion: voiceEmotion,
        style: voiceSelectedStyle,
      };

      // Step 1: Request script generation from backend
      const scriptPromise = fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: niche.trim() || 'Stoic Wisdom & Quotes',
          topic: topicPrompt.trim() || `The hidden secret of ${niche || 'stoic philosophy'}`,
          styleReference: styleReference.trim(),
          duration,
          language,
          voiceEmotion,
          voiceSettings,
          visualStyle: visualStyle === 'custom' && customStylePrompt ? customStylePrompt : visualStyle,
          captionStyle,
          musicMood,
          platform: 'youtube',
          category: youtubeCategory,
          includeShortsTag,
        }),
      });

      // Pipeline stages visual timeline
      const p1 = setTimeout(() => {
        setProgressState('writing');
        setProgressPercent(25);
        setCurrentStageText('Writing 3-Second Thumb-Stopping Hook & Script Continuity...');
      }, 700);

      const p2 = setTimeout(() => {
        setProgressState('storyboard');
        setProgressPercent(40);
        setCurrentStageText('Generating Scene Storyboards & Visual Prompts...');
      }, 1400);

      const p3 = setTimeout(() => {
        setProgressState('voice');
        setProgressPercent(55);
        setCurrentStageText(`Synthesizing Expressive Voiceover with ${selectedVoice.name} (${voiceEmotion})...`);
      }, 2200);

      const p4 = setTimeout(() => {
        setProgressState('visuals');
        setProgressPercent(70);
        setCurrentStageText('Selecting 9:16 Vertical Visual Frames & Color Continuity...');
      }, 3000);

      const p5 = setTimeout(() => {
        setProgressState('compositing');
        setProgressPercent(82);
        setCurrentStageText('Compositing Timeline, Karaoke Captions & SFX Cues...');
      }, 3800);

      const response = await scriptPromise;
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(p4);
      clearTimeout(p5);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate story from AI engine');
      }

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Generation error');
      }

      const generated = resData.data;

      setProgressState('rendering');
      setProgressPercent(92);
      setCurrentStageText('Rendering 1080x1920 Master Short Video Preview...');

      await new Promise((r) => setTimeout(r, 600));

      const selectedTrack = MUSIC_TRACKS.find(t => t.mood === musicMood) || MUSIC_TRACKS[0];

      const newProject: VideoProject = {
        id: `vid-${Date.now()}`,
        title: generated.title.includes('#Shorts') ? generated.title : `${generated.title} #Shorts`,
        description: generated.description,
        hashtags: generated.hashtags,
        tags: generated.tags,
        niche: niche || 'Stoic Wisdom & Quotes',
        topic: topicPrompt || `Mastering ${niche}`,
        styleReference: styleReference || '',
        duration,
        language,
        voiceId: selectedVoiceId,
        voiceEmotion,
        voiceSettings,
        visualStyle,
        captionStyle,
        musicTrackId: selectedTrack.id,
        musicVolume: 0.28,
        voiceVolume: 0.95,
        sfxVolume: 0.85,
        targetPlatforms: ['youtube'],
        scenes: generated.scenes,
        storyAnalysis: generated.storyAnalysis,
        thumbnailUrl: generated.scenes[0]?.visualUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalDuration: duration,
        viralScore: generated.viralScore || 92,
        youtubeCategory: youtubeCategory as any,
        visibility: 'public',
        madeForKids: false,
      };

      // Save to database
      await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      // Kick off background render pipeline job
      fetch('/api/render/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: newProject }),
      }).catch(console.error);

      setProgressState('ready');
      setProgressPercent(100);
      setCurrentStageText('Video ready! Launching Timeline Editor...');

      setTimeout(() => {
        onVideoCreated(newProject);
      }, 700);

    } catch (err: any) {
      console.error(err);
      setProgressState('failed');
      setErrorMessage(err.message || 'An error occurred during video creation.');
    }
  };

  const filteredVoices = NATURAL_VOICES.filter(v => v.gender === voiceGender);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Story Engine & Faceless Creator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create New Viral Short Video
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Deep narrative analysis, expressive voiceover, and 9:16 visual continuity tailored exclusively for YouTube Shorts.
          </p>
        </div>

        <button
          id="btn-generate-main-top"
          disabled={progressState !== 'idle' && progressState !== 'failed'}
          onClick={handleStartGeneration}
          className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-500 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-rose-500/25 transition-all disabled:opacity-50 active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Full Video</span>
        </button>
      </div>

      {/* Free VIP Access Active Notice */}
      {isFreeAccessUser && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-slate-900 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white">100% Free VIP Access Active:</span>{' '}
              <span>Your email is authorized for unlimited video creations, custom voices, and direct YouTube Shorts publishing.</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider shrink-0">
            Unlimited Tier
          </span>
        </div>
      )}

      {/* Progress State Overlay if Generating */}
      {progressState !== 'idle' && progressState !== 'failed' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl space-y-6 animate-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Creating Master 9:16 Video Blueprint
                </h3>
                <p className="text-xs text-rose-400 font-medium mt-0.5">
                  {currentStageText}
                </p>
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {progressPercent}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 8 Pipeline Stages Tracker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
            {[
              { label: '1. Story Analysis', active: progressPercent >= 15 },
              { label: '2. Viral Script & Hook', active: progressPercent >= 30 },
              { label: '3. Storyboard & Continuity', active: progressPercent >= 45 },
              { label: '4. Voice Synthesis', active: progressPercent >= 60 },
              { label: '5. 9:16 Visual Framing', active: progressPercent >= 75 },
              { label: '6. Timeline Compositing', active: progressPercent >= 85 },
              { label: '7. Subtitle Karaoke & SFX', active: progressPercent >= 95 },
              { label: '8. Finalizing Master', active: progressPercent >= 100 },
            ].map((stg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                  stg.active
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 font-medium'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${stg.active ? 'bg-rose-400 animate-pulse' : 'bg-slate-700'}`} />
                <span className="truncate">{stg.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            className="text-white hover:underline font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Prompt, Style Reference, Visual Styles, Expressive Voice Studio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Topic / Niche & Style Reference (Optional, up to 5,000 & 2,000 chars) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Niche, Topic & Writing Style Reference</span>
              </h3>
              <span className="text-xs text-slate-500">Step 1 of 4</span>
            </div>

            <div className="space-y-4">
              {/* Niche Category Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Niche Category (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {NICHES.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        setNiche(n.name);
                        if (!topicPrompt) setTopicPrompt(n.hookPrompt);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                        niche === n.name
                          ? 'bg-rose-500/20 border-rose-500 text-white font-semibold shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="truncate">{n.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Niche / Topic Box (Up to 5,000 chars) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                    <span>Niche / Video Topic (Optional — Up to 5,000 Characters)</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {topicPrompt.length} / 5,000
                  </span>
                </div>
                <textarea
                  id="textarea-create-topic"
                  rows={4}
                  maxLength={5000}
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                  placeholder="Enter custom story details, facts, characters, or specific ideas... E.g., The untold truth about how Roman Emperor Marcus Aurelius conquered severe panic attacks using negative visualization during the Antonine Plague."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Example Script / Style Reference Box (Up to 2,000 chars) */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Example Script / Style Reference (Optional — Up to 2,000 Characters)</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {styleReference.length} / 2,000
                  </span>
                </div>
                <p className="text-[11px] text-cyan-400/90 leading-relaxed">
                  💡 <strong>Notice:</strong> This is <em>NOT</em> the script to copy. It is only a writing-style reference that tells the AI how the story/script should feel (e.g. suspenseful tone, short sentences, dark punchy rhythm). The AI will generate an original script inspired by this style.
                </p>
                <textarea
                  id="textarea-style-reference"
                  rows={3}
                  maxLength={2000}
                  value={styleReference}
                  onChange={(e) => setStyleReference(e.target.value)}
                  placeholder="Example: Write like a dark cinematic mystery story with short sentences, suspenseful narration, dramatic pauses, and a shocking twist ending."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: 13 Visual Styles Grid */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Visual Art Style (13 Selectable Styles)</span>
              </h3>
              <span className="text-xs text-slate-500">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
              {VIDEO_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setVisualStyle(style.id)}
                  className={`group relative rounded-2xl overflow-hidden border text-left transition-all aspect-[9/14] flex flex-col justify-end p-2.5 ${
                    visualStyle === style.id
                      ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/20'
                      : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={style.previewUrl}
                    alt={style.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  
                  {visualStyle === style.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  <div className="relative z-10">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 text-[9px] font-bold uppercase mb-1">
                      {style.badge}
                    </span>
                    <div className="font-bold text-white text-xs leading-tight">
                      {style.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {visualStyle === 'custom' && (
              <div className="pt-2 animate-in fade-in">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Custom Art Style Prompt Modifier
                </label>
                <input
                  type="text"
                  value={customStylePrompt}
                  onChange={(e) => setCustomStylePrompt(e.target.value)}
                  placeholder="E.g., Renaissance oil painting with chiaroscuro Caravaggio lighting, 9:16 vertical composition"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            )}
          </div>

          {/* Section 3: Expressive AI Voice Studio */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Expressive AI Voice Studio</span>
              </h3>
              <span className="text-xs text-slate-500">Step 3 of 4</span>
            </div>

            {/* Gender Toggle & Prioritized Natural Male Voices */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setVoiceGender('male');
                  setSelectedVoiceId('voice-marcus');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  voiceGender === 'male'
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white border-rose-400 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Natural Male Voices (High Priority)
              </button>
              <button
                type="button"
                onClick={() => {
                  setVoiceGender('female');
                  setSelectedVoiceId('voice-sophia');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  voiceGender === 'female'
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white border-rose-400 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Expressive Female Voices
              </button>
            </div>

            {/* Voice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredVoices.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVoiceId(v.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedVoiceId === v.id
                      ? 'bg-rose-500/10 border-rose-500 shadow-md shadow-rose-500/10'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs sm:text-sm">{v.name}</span>
                        {v.isMaleNaturalPriority && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold uppercase">
                            Deep Priority
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{v.accent}</div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAuditionVoice(v);
                      }}
                      className={`p-2 rounded-xl transition-all ${
                        auditioningVoice === v.id
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                      title="Audition Voice"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Emotions Grid */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Master Emotion & Pacing
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VOICE_EMOTIONS.slice(0, 6).map((emo) => (
                  <button
                    key={emo.id}
                    type="button"
                    onClick={() => setVoiceEmotion(emo.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      voiceEmotion === emo.id
                        ? 'bg-purple-500/20 border-purple-500 text-white font-bold shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-white">{emo.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{emo.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Sliders (Speed, Pitch, Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Speed:</span>
                  <span className="font-mono text-rose-400">{voiceSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Pitch:</span>
                  <span className="font-mono text-purple-400">{voicePitch > 0 ? `+${voicePitch}` : voicePitch}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Delivery Style</label>
                <select
                  value={voiceSelectedStyle}
                  onChange={(e) => setVoiceSelectedStyle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
                >
                  {VOICE_STYLES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Duration, Captions, Music, YouTube Defaults */}
        <div className="space-y-6">
          {/* Duration & Language Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Target Duration & Language</span>
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Shorts Duration</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDuration(sec as DurationOption)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      duration === sec
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Narration Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Captions Style */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Type className="w-4 h-4 text-rose-400" />
              <span>9:16 Caption Animation</span>
            </h3>

            <div className="space-y-2">
              {captionStyles.map((cap) => (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => setCaptionStyle(cap.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    captionStyle === cap.id
                      ? 'bg-rose-500/10 border-rose-500 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{cap.name}</span>
                    {captionStyle === cap.id && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                  <div className={`mt-2 p-2 rounded-lg text-center text-xs ${cap.previewClass}`}>
                    {cap.sample}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Music Track Mood */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Music className="w-4 h-4 text-cyan-400" />
              <span>Royalty-Free Music Mood</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dark-phonk', label: 'Dark Phonk / Drift' },
                { id: 'epic-cinematic', label: 'Epic Cinematic' },
                { id: 'lofi-chill', label: 'Lo-Fi Chill' },
                { id: 'ambient-mystic', label: 'Ambient Mystic' },
                { id: 'cyberpunk-synth', label: 'Cyberpunk Synth' },
                { id: 'inspiring-piano', label: 'Inspiring Piano' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMusicMood(m.id as MusicMood)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    musicMood === m.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* YouTube Category & Defaults */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-red-500" />
              <span>YouTube Shorts Defaults</span>
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Upload Category</label>
              <select
                value={youtubeCategory}
                onChange={(e) => setYoutubeCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Education">Education & Insights</option>
                <option value="Entertainment">Entertainment & Drama</option>
                <option value="Science & Technology">Science & Technology</option>
                <option value="People & Blogs">People & Philosophy</option>
                <option value="Howto & Style">Howto & Self Growth</option>
              </select>
            </div>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={includeShortsTag}
                onChange={(e) => setIncludeShortsTag(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-rose-500"
              />
              <span>Auto-append #Shorts to title & tags</span>
            </label>
          </div>

          {/* Bottom CTA Button */}
          <button
            id="btn-generate-main-bottom"
            disabled={progressState !== 'idle' && progressState !== 'failed'}
            onClick={handleStartGeneration}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-500 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-rose-500/25 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Full Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
