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
  Share2
} from 'lucide-react';
import {
  DurationOption,
  VisualStyle,
  CaptionStyle,
  MusicMood,
  VoiceEmotion,
  PlatformType,
  VideoProject,
  GenerationProgressState
} from '../types';
import { NICHES, LANGUAGES, VOICE_PRESETS, MUSIC_TRACKS } from '../data/mockTemplates';
import { audioEngine } from '../utils/audioEngine';

interface CreateVideoViewProps {
  initialNiche?: string;
  initialPrompt?: string;
  onVideoCreated: (video: VideoProject) => void;
}

export const CreateVideoView: React.FC<CreateVideoViewProps> = ({
  initialNiche = 'Stoic Wisdom & Quotes',
  initialPrompt = '',
  onVideoCreated,
}) => {
  // Form State
  const [niche, setNiche] = useState(initialNiche);
  const [topicPrompt, setTopicPrompt] = useState(initialPrompt);
  const [duration, setDuration] = useState<DurationOption>(30);
  const [language, setLanguage] = useState('en');
  const [selectedVoiceId, setSelectedVoiceId] = useState('voice-marcus');
  const [voiceEmotion, setVoiceEmotion] = useState<VoiceEmotion>('dramatic');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('cinematic-hyperrealistic');
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('hormozi-bold-glow');
  const [musicMood, setMusicMood] = useState<MusicMood>('dark-phonk');
  const [youtubeCategory, setYoutubeCategory] = useState<string>('Education');
  const [includeShortsTag, setIncludeShortsTag] = useState(true);

  // Generation Pipeline State
  const [progressState, setProgressState] = useState<GenerationProgressState>('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStageText, setCurrentStageText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [auditioningVoice, setAuditioningVoice] = useState<string | null>(null);

  const visualStyles: { id: VisualStyle; name: string; desc: string; img: string }[] = [
    {
      id: 'cinematic-hyperrealistic',
      name: 'Cinematic Realistic',
      desc: '8K photorealistic lighting, dramatic depth of field',
      img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'dark-cyberpunk',
      name: 'Dark Cyberpunk',
      desc: 'Neon hues, futuristic holograms, moody shadows',
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'documentary-noir',
      name: 'Documentary Noir',
      desc: 'Classic monochrome statues, golden amber accents',
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: '3d-pixar',
      name: '3D Render / Pixar',
      desc: 'Vibrant stylized 3D characters and lively environments',
      img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'vintage-film',
      name: 'Vintage Film Grain',
      desc: '1970s analogue grain, retro textures, VHS distortion',
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'minimalist-motion',
      name: 'Minimalist Motion',
      desc: 'Clean geometric typography, UI diagrams, sleek vectors',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80',
    },
  ];

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

  const emotions: { id: VoiceEmotion; label: string }[] = [
    { id: 'dramatic', label: 'Dramatic & Deep' },
    { id: 'motivational', label: 'High Motivation' },
    { id: 'energetic', label: 'Energetic & Viral' },
    { id: 'mysterious', label: 'Mysterious / Eerie' },
    { id: 'chill', label: 'Chill & Relaxed' },
    { id: 'authoritative', label: 'Authoritative' },
    { id: 'storyteller', label: 'Wise Storyteller' },
  ];

  const handleAuditionVoice = (voice: typeof VOICE_PRESETS[0]) => {
    setAuditioningVoice(voice.id);
    const sampleText = `Hello creator! This is ${voice.name}, ready to narrate your next viral short video.`;
    audioEngine.speakNarration(sampleText, voice.tone, 1.0, undefined, () => {
      setAuditioningVoice(null);
    });
  };

  const handleStartGeneration = async () => {
    if (!topicPrompt.trim()) {
      setTopicPrompt(`The most powerful psychological truth about ${niche}`);
    }

    setProgressState('researching');
    setProgressPercent(10);
    setCurrentStageText('Researching viral hooks & retention angles...');
    setErrorMessage('');

    try {
      // Step 1: Research & Script via Gemini backend
      const scriptPromise = fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche,
          topic: topicPrompt.trim() || `The ultimate guide to ${niche}`,
          duration,
          language,
          voiceEmotion,
          visualStyle,
          captionStyle,
          musicMood,
          platform: 'youtube',
          category: youtubeCategory,
          includeShortsTag,
        }),
      });

      // Simulation progress updates while Gemini calculates
      const p1 = setTimeout(() => {
        setProgressState('writing');
        setProgressPercent(28);
        setCurrentStageText('Writing 3-second hook, body scenes & CTA...');
      }, 900);

      const p2 = setTimeout(() => {
        setProgressState('voice');
        setProgressPercent(45);
        setCurrentStageText(`Synthesizing voiceover with ${VOICE_PRESETS.find(v => v.id === selectedVoiceId)?.name || 'AI Voice'}...`);
      }, 2000);

      const p3 = setTimeout(() => {
        setProgressState('visuals');
        setProgressPercent(65);
        setCurrentStageText('Selecting 9:16 vertical visual frames & color grades...');
      }, 3200);

      const p4 = setTimeout(() => {
        setProgressState('editing');
        setProgressPercent(82);
        setCurrentStageText('Synchronizing karaoke captions & sound effect cues...');
      }, 4400);

      const response = await scriptPromise;
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(p4);

      if (!response.ok) {
        throw new Error('Failed to generate script from AI engine');
      }

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Generation error');
      }

      const generated = resData.data;

      setProgressState('rendering');
      setProgressPercent(95);
      setCurrentStageText('Compiling 9:16 video timeline into editor...');

      await new Promise((r) => setTimeout(r, 600));

      const selectedTrack = MUSIC_TRACKS.find(t => t.mood === musicMood) || MUSIC_TRACKS[0];

      const newProject: VideoProject = {
        id: `vid-${Date.now()}`,
        title: generated.title.includes('#Shorts') ? generated.title : `${generated.title} #Shorts`,
        description: generated.description,
        hashtags: generated.hashtags,
        niche,
        topic: topicPrompt,
        duration,
        language,
        voiceId: selectedVoiceId,
        voiceEmotion,
        visualStyle,
        captionStyle,
        musicTrackId: selectedTrack.id,
        musicVolume: 0.3,
        voiceVolume: 0.95,
        targetPlatforms: ['youtube'],
        scenes: generated.scenes,
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

      // Save to backend database
      await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      setProgressState('ready');
      setProgressPercent(100);
      setCurrentStageText('Video ready! Launching Timeline Editor...');

      setTimeout(() => {
        onVideoCreated(newProject);
      }, 800);

    } catch (err: any) {
      console.error(err);
      setProgressState('failed');
      setErrorMessage(err.message || 'An error occurred during video creation.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Faceless Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create New Viral Short Video
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure your creative blueprint. AutoReel handles scripting, voiceover, visuals, captions, and music.
          </p>
        </div>

        <button
          id="btn-generate-main-top"
          disabled={progressState !== 'idle' && progressState !== 'failed'}
          onClick={handleStartGeneration}
          className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-500 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-rose-500/25 transition-all disabled:opacity-50 active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Full Video</span>
        </button>
      </div>

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
                  Creating 9:16 Video Blueprint
                </h3>
                <p className="text-xs text-rose-400 font-medium mt-0.5">
                  {currentStageText}
                </p>
              </div>
            </div>
            <div className="text-xl font-black font-mono text-white">
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

          {/* Progress Stages Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            {[
              { label: '1. Viral Hook & Script', active: progressPercent >= 20 },
              { label: '2. AI Voiceover Synthesis', active: progressPercent >= 45 },
              { label: '3. Visual Frames & SFX', active: progressPercent >= 70 },
              { label: '4. Captions & 9:16 Timeline', active: progressPercent >= 90 },
            ].map((stg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                  stg.active
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 font-medium'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${stg.active ? 'bg-rose-400' : 'bg-slate-700'}`} />
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

      {/* Main Form Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Prompt, Duration, Visuals, Voice */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Topic & Niche */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Niche & Video Topic</span>
              </h3>
              <span className="text-xs text-slate-500">Step 1 of 4</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Niche Category
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

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Specific Topic / Custom Prompt
                </label>
                <textarea
                  id="textarea-create-topic"
                  rows={3}
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                  placeholder="E.g., 3 mental tricks of Marcus Aurelius that stop anxiety and negative thoughts instantly..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Duration, Language, Platforms */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Duration, Language & Target Platforms</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Duration */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Target Duration
                </label>
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

              {/* Language */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Narration Language
                </label>
                <select
                  id="select-create-language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* YouTube Category */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  YouTube Category
                </label>
                <select
                  id="select-youtube-category"
                  value={youtubeCategory}
                  onChange={(e) => setYoutubeCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
                >
                  <option value="Education">Education & Insights</option>
                  <option value="Entertainment">Entertainment & Drama</option>
                  <option value="Science & Technology">Science & Tech</option>
                  <option value="People & Blogs">People & Philosophy</option>
                  <option value="Howto & Style">Howto & Self Growth</option>
                  <option value="Gaming">Gaming & Lore</option>
                </select>
              </div>
            </div>

            {/* YouTube Shorts Algorithm Feature Badges */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-slate-300 font-medium">Auto-Optimized for YouTube Shorts Algorithm</span>
              </div>
              <label className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeShortsTag}
                  onChange={(e) => setIncludeShortsTag(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-red-500 focus:ring-red-500/20"
                />
                <span className="text-[11px] font-semibold text-red-400">Append #Shorts to Title</span>
              </label>
            </div>
          </div>

          {/* Section 3: Visual Style Selection */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Visual Art Style (9:16 Vertical)</span>
              </h3>
              <span className="text-xs text-slate-500">Curated AI & 8K Stock</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {visualStyles.map((vs) => (
                <div
                  key={vs.id}
                  onClick={() => setVisualStyle(vs.id)}
                  className={`relative rounded-xl overflow-hidden border cursor-pointer group transition-all ${
                    visualStyle === vs.id
                      ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-lg'
                      : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img
                      src={vs.img}
                      alt={vs.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span className="truncate">{vs.name}</span>
                      {visualStyle === vs.id && (
                        <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {vs.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Voice Studio & Caption Style */}
        <div className="space-y-6">
          {/* AI Voice Selection */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>AI Voice & Tone</span>
            </h3>

            {/* Voice Emotion Tag */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Tone / Emotion
              </label>
              <select
                id="select-voice-emotion"
                value={voiceEmotion}
                onChange={(e) => setVoiceEmotion(e.target.value as VoiceEmotion)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                {emotions.map((em) => (
                  <option key={em.id} value={em.id}>
                    {em.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Cards */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Select Voice Profile
              </label>
              {VOICE_PRESETS.map((v) => {
                const isSelected = selectedVoiceId === v.id;
                const isAuditioning = auditioningVoice === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVoiceId(v.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-rose-500/10 border-rose-500 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center space-x-1.5">
                        <span>{v.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {v.gender}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {v.accent}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAuditionVoice(v);
                      }}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                        isAuditioning
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      title="Audition Voice Sample"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="text-[10px]">Test</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caption Style */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Type className="w-4 h-4 text-amber-400" />
              <span>Caption Typography</span>
            </h3>

            <div className="space-y-2.5">
              {captionStyles.map((cs) => (
                <div
                  key={cs.id}
                  onClick={() => setCaptionStyle(cs.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    captionStyle === cs.id
                      ? 'bg-amber-500/10 border-amber-500/80 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{cs.name}</span>
                    {captionStyle === cs.id && (
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className={`p-2 rounded-lg text-center text-xs ${cs.previewClass}`}>
                    {cs.sample}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Music Mood Selector */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Music className="w-4 h-4 text-emerald-400" />
              <span>Royalty-Free Music Mood</span>
            </h3>

            <select
              id="select-music-mood"
              value={musicMood}
              onChange={(e) => {
                const mood = e.target.value as MusicMood;
                setMusicMood(mood);
                audioEngine.playMusicTrack(mood, 0.25);
                setTimeout(() => audioEngine.stopMusic(), 3000);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
            >
              {MUSIC_TRACKS.map((m) => (
                <option key={m.id} value={m.mood}>
                  {m.title} ({m.mood.toUpperCase()})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500">
              Plays 3-second audio preview when selected. 100% royalty-free for monetization.
            </p>
          </div>

          {/* Bottom Generate Button */}
          <button
            id="btn-generate-main-bottom"
            disabled={progressState !== 'idle' && progressState !== 'failed'}
            onClick={handleStartGeneration}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-500 hover:from-rose-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Faceless Short Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
