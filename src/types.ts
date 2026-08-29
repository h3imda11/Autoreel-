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
  | 'cinematic-hyperrealistic'
  | 'dark-cyberpunk'
  | 'anime-manga'
  | '3d-pixar'
  | 'vintage-film'
  | 'documentary-noir'
  | 'minimalist-motion';

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
  | 'dramatic'
  | 'motivational'
  | 'energetic'
  | 'mysterious'
  | 'chill'
  | 'authoritative'
  | 'storyteller';

export interface VoicePreset {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
  previewUrl?: string;
  tone: VoiceEmotion;
  geminiVoiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
  description: string;
  style?: string;
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
}

export type VideoStatus = 'draft' | 'generating' | 'rendered' | 'scheduled' | 'published' | 'failed';

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  niche: string;
  topic: string;
  duration: DurationOption;
  language: string;
  voiceId: string;
  voiceEmotion: VoiceEmotion;
  visualStyle: VisualStyle;
  captionStyle: CaptionStyle;
  musicTrackId: string;
  musicVolume: number; // 0 to 1
  voiceVolume: number; // 0 to 1
  targetPlatforms: PlatformType[];
  scenes: VideoScene[];
  thumbnailUrl?: string;
  renderedVideoUrl?: string;
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'starter' | 'creator-pro' | 'viral-agency';
  creditsRemaining: number;
  creditsTotal: number;
  videosCreatedThisMonth: number;
  videosLimit: number;
  defaultChannelId?: string;
}

export type GenerationProgressState = 
  | 'idle'
  | 'researching'
  | 'writing'
  | 'voice'
  | 'visuals'
  | 'editing'
  | 'rendering'
  | 'ready'
  | 'failed';
