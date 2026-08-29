export type PlatformType = 'youtube';

export type DurationOption = 15 | 30 | 45 | 60;

export type YouTubeCategory = 
  | 'Entertainment'
  | 'Education'
  | 'Science & Technology'
  | 'People & Blogs'
  | 'Howto & Style'
  | 'Gaming'
  | 'News & Politics';

export type YouTubeVisibility = 'public' | 'unlisted' | 'private' | 'scheduled';

export type VisualStyle = 
  | 'realistic-cinematic'
  | 'anime'
  | 'cartoon'
  | 'comic-book'
  | '3d-animation'
  | '2d-animation'
  | 'dark-fantasy'
  | 'cyberpunk'
  | 'dark-cyberpunk'
  | 'watercolor'
  | 'clay-stop-motion'
  | 'pixel-art'
  | 'documentary'
  | 'documentary-noir'
  | 'cinematic-hyperrealistic'
  | 'minimalist-motion'
  | 'vintage-film'
  | 'custom';

export type CaptionStyle =
  | 'hormozi-bold-glow'
  | 'word-by-word-karaoke'
  | 'minimal-clean'
  | 'cyber-neon'
  | 'retro-subtitles';

export type MusicMood =
  | 'lofi-chill'
  | 'epic-orchestral'
  | 'dark-phonk'
  | 'synthwave'
  | 'ambient-meditation'
  | 'upbeat-pop'
  | 'suspense-thriller';

export type VoiceEmotion =
  | 'suspense'
  | 'fear'
  | 'excitement'
  | 'sadness'
  | 'anger'
  | 'surprise'
  | 'comedy'
  | 'dramatic'
  | 'motivational'
  | 'authoritative'
  | 'storyteller'
  | 'energetic'
  | 'mysterious'
  | 'chill';

export interface VoicePreset {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
  language: string;
  tone: VoiceEmotion;
  geminiVoiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Aoede' | 'Leda' | 'Orus';
  description: string;
  style?: string;
  recommendedNiches: string[];
  isMaleNaturalPriority?: boolean;
}

export interface SoundEffect {
  id: string;
  name: string;
  category: 'impact' | 'transition' | 'notification' | 'riser' | 'atmosphere';
  duration: number; // in seconds
  audioKey: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  mood: MusicMood;
  duration: number; // in seconds
  bpm: number;
  tags: string[];
  audioKey: string;
  genre?: string;
}

export interface CaptionWord {
  word: string;
  start: number; // seconds
  end: number;   // seconds
}

export interface VideoScene {
  id: string;
  order: number;
  duration: number; // seconds
  narration: string;
  visualPrompt: string;
  visualUrl?: string;
  visualType: 'image' | 'video' | 'gradient';
  captionText: string;
  captionWords?: CaptionWord[];
  transition: 'fade' | 'zoom-in' | 'slide-left' | 'glitch' | 'dissolve' | 'wipe';
  soundEffect?: string; // id from sound effects
  soundEffectTiming?: number; // offset in seconds
  sceneEmotion?: VoiceEmotion;
  continuityNotes?: string;
}

export type VideoStatus = 'draft' | 'generating' | 'rendering' | 'ready' | 'scheduled' | 'uploading' | 'published' | 'failed';

export interface StoryAnalysis {
  storyStructure: string;
  characters: string[];
  setting: string;
  mood: string;
  pacing: string;
  importantEvents: string[];
  emotionalArc: string;
  ending: string;
  continuityNotes: string;
}

export interface VoiceSettings {
  gender: 'male' | 'female';
  language: string;
  accent: string;
  speed: number; // 0.75 to 1.5
  pitch: number; // -5 to +5
  emotion: VoiceEmotion;
  style: string;
}

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  tags?: string[];
  niche: string;
  topic: string;
  styleReference?: string;
  customStylePrompt?: string;
  storyAnalysis?: StoryAnalysis;
  duration: DurationOption;
  language: string;
  voiceId: string;
  voiceEmotion: VoiceEmotion;
  voiceSettings?: VoiceSettings;
  visualStyle: VisualStyle;
  captionStyle: CaptionStyle;
  musicTrackId: string;
  musicVolume: number; // 0 to 1
  voiceVolume: number; // 0 to 1
  sfxVolume?: number;  // 0 to 1
  targetPlatforms: PlatformType[];
  scenes: VideoScene[];
  thumbnailUrl?: string;
  renderedVideoUrl?: string;
  renderJobId?: string;
  renderProgress?: number;
  renderStage?: string;
  status: VideoStatus;
  createdAt: string;
  updatedAt: string;
  totalDuration: number;
  publishedUrls?: {
    youtube?: string;
  };
  youtubeChannelId?: string;
  youtubeCategory?: YouTubeCategory;
  visibility?: YouTubeVisibility;
  madeForKids?: boolean;
  scheduledFor?: string;
  views?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  subscribersGained?: number;
  watchTimeHours?: number;
  viewedVsSwipedPercent?: number; // YouTube Shorts feed metric
  retentionRate?: number;
  viralScore?: number;
  estimatedRevenue?: number;
  errorMessage?: string;
}

export interface ContentPlanItem {
  id: string;
  day: number;
  date?: string;
  niche?: string;
  title?: string;
  topic?: string;
  hook: string;
  angle: string;
  cta?: string;
  targetPlatform?: PlatformType[];
  suggestedDuration?: DurationOption;
  bestPostingTime?: string;
  viralProbability: number; // 1-100%
  status?: 'idea' | 'generated' | 'scheduled' | 'published';
  projectId?: string;
}

export interface ContentCalendarPlan {
  id: string;
  niche: string;
  totalDays: 7 | 30;
  postingFrequency: number; // per day
  createdAt: string;
  items: ContentPlanItem[];
}

export interface ScheduledPost {
  id: string;
  projectId: string;
  projectTitle: string;
  thumbnailUrl?: string;
  platform: PlatformType;
  channelId?: string;
  channelTitle?: string;
  scheduledTime: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'retry-queued';
  autoRetryCount?: number;
  caption?: string;
  publishedUrl?: string;
  errorMessage?: string;
  lastAttemptAt?: string;
}

export interface SocialAccount {
  id: string;
  platform: PlatformType;
  channelId?: string;
  channelTitle?: string;
  accountName?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  connected: boolean;
  connectedAt?: string;
  followers?: number;
  followersCount?: number;
  subscribersCount?: number;
  totalViews?: number;
  totalUploads?: number;
  tokenExpiresAt?: string;
  healthStatus?: 'healthy' | 'expiring_soon' | 'expired' | 'disconnected';
  autoPublishEnabled?: boolean;
  isDefault?: boolean;
  monetized?: boolean;
  defaultVisibility?: YouTubeVisibility;
  quotaUsedPercent?: number;
}

export interface VideoTemplate {
  id: string;
  name: string;
  niche: string;
  description: string;
  badge: string;
  thumbnailUrl: string;
  defaultDuration?: DurationOption;
  duration?: number;
  visualStyle?: VisualStyle;
  style?: string;
  captionStyle?: CaptionStyle;
  musicMood?: MusicMood;
  voiceEmotion?: VoiceEmotion;
  sampleHook?: string;
  hookSample?: string;
  samplePrompt?: string;
  sampleStyleReference?: string;
  estimatedViews: string;
}

export interface AnalyticsOverview {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSubscribersGained: number;
  totalWatchTimeHours: number;
  averageRetentionRate: number;
  viewedVsSwipedPercent: number;
  viralScoreAverage: number;
  viewsGrowthPercent: number;
  estimatedRevenue: number;
  retentionCurve: { second: number; retention: number }[];
  topVideos: VideoProject[];
  aiInsights: string[];
}

export interface FreeAccessLimits {
  maxVideosPerMonth: number;
  maxCharsPerPrompt: number;
  allowCustomVoice: boolean;
  allowAutoYouTube: boolean;
  hdExport: boolean;
}

export interface FreeAccessEmailEntry {
  id: string;
  email: string;
  addedBy: string;
  addedAt: string;
  note?: string;
  status: 'active' | 'revoked';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  plan: 'starter' | 'creator-pro' | 'viral-agency' | 'free-vip';
  creditsRemaining: number;
  creditsTotal: number;
  videosCreatedThisMonth: number;
  videosLimit: number;
  isFreeAccessUser: boolean;
  isEmailVerified: boolean;
  freeTierLimits?: FreeAccessLimits;
  defaultChannelId?: string;
  createdAt?: string;
}

export type GenerationProgressState = 
  | 'idle'
  | 'analyzing'
  | 'writing'
  | 'storyboard'
  | 'voice'
  | 'visuals'
  | 'compositing'
  | 'rendering'
  | 'finalizing'
  | 'ready'
  | 'failed';

export interface RenderJob {
  id: string;
  projectId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  stage: string;
  progress: number;
  outputUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}
