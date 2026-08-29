import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to initialize Gemini Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Real AI generation will return fallback high-quality templates.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Database Store for State Persistence
interface DatabaseStore {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    plan: 'starter' | 'creator-pro' | 'viral-agency';
    creditsRemaining: number;
    creditsTotal: number;
    videosCreatedThisMonth: number;
    videosLimit: number;
  };
  videos: any[];
  schedules: any[];
  socialAccounts: any[];
  contentPlans: any[];
}

const DB: DatabaseStore = {
  user: {
    id: 'usr-autoreel-01',
    name: 'Alex Creator',
    email: 'sachinmurali90@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    plan: 'creator-pro',
    creditsRemaining: 48,
    creditsTotal: 60,
    videosCreatedThisMonth: 12,
    videosLimit: 60,
  },
  videos: [
    {
      id: 'vid-stoic-01',
      title: '3 Stoic Rules That Destroy Anxiety Instantly',
      description: 'Master your emotions with these 3 ancient Stoic principles from Marcus Aurelius and Seneca. Stop overthinking and regain control today.',
      hashtags: ['#Stoicism', '#Mindset', '#MarcusAurelius', '#Shorts', '#SelfDiscipline', '#Viral'],
      niche: 'Stoic Wisdom & Quotes',
      topic: 'How to stop worrying about what you cannot control',
      duration: 30,
      language: 'en',
      voiceId: 'voice-marcus',
      voiceEmotion: 'dramatic',
      visualStyle: 'documentary-noir',
      captionStyle: 'hormozi-bold-glow',
      musicTrackId: 'music-dark-phonk',
      musicVolume: 0.28,
      voiceVolume: 0.95,
      targetPlatforms: ['youtube', 'instagram', 'tiktok'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      status: 'published',
      createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      totalDuration: 30,
      publishedUrls: {
        youtube: 'https://youtube.com/shorts/sample1',
        instagram: 'https://instagram.com/reel/sample1',
        tiktok: 'https://tiktok.com/@autoreel/video/sample1',
      },
      views: 142500,
      likes: 12400,
      shares: 3120,
      comments: 640,
      watchTimeSeconds: 384000,
      retentionRate: 88.4,
      viralScore: 94,
      scenes: [
        {
          id: 'sc-1',
          order: 1,
          duration: 6,
          narration: 'If you want to control everything in your life, first learn to master this one brutal rule.',
          visualPrompt: 'Ancient Roman marble statue of Marcus Aurelius in deep mist with golden rim lighting, cinematic 9:16 vertical composition',
          visualUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
          visualType: 'image',
          captionText: 'MASTER THIS ONE BRUTAL RULE',
          transition: 'zoom-in',
          soundEffect: 'sfx-whoosh-fast',
          soundEffectTiming: 0.1,
          captionWords: [
            { word: 'MASTER', start: 0.2, end: 1.0 },
            { word: 'THIS', start: 1.0, end: 1.5 },
            { word: 'ONE', start: 1.5, end: 2.2 },
            { word: 'BRUTAL', start: 2.2, end: 3.5 },
            { word: 'RULE', start: 3.5, end: 5.5 }
          ]
        },
        {
          id: 'sc-2',
          order: 2,
          duration: 8,
          narration: 'You suffer more in imagination than you do in reality. Ninety percent of what you dread will never happen.',
          visualPrompt: 'Dark moody silhouette standing on a stormy cliff overlooking a turbulent ocean, thunderous sky, dark monochrome',
          visualUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
          visualType: 'image',
          captionText: 'YOU SUFFER MORE IN IMAGINATION',
          transition: 'glitch',
          soundEffect: 'sfx-bass-drop',
          soundEffectTiming: 0.2,
          captionWords: [
            { word: 'YOU', start: 0.1, end: 0.8 },
            { word: 'SUFFER', start: 0.8, end: 2.0 },
            { word: 'MORE', start: 2.0, end: 3.0 },
            { word: 'IN', start: 3.0, end: 3.8 },
            { word: 'IMAGINATION', start: 3.8, end: 6.5 }
          ]
        },
        {
          id: 'sc-3',
          order: 3,
          duration: 8,
          narration: 'Stop trying to change others. The only territory you have absolute sovereignty over is your own thoughts.',
          visualPrompt: 'Glowing golden geometric sphere shattering into crystalline particles in dark void, 8k render',
          visualUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
          visualType: 'image',
          captionText: 'CONTROL YOUR OWN SOVEREIGNTY',
          transition: 'fade',
          soundEffect: 'sfx-bell-ding',
          soundEffectTiming: 0.1,
          captionWords: [
            { word: 'CONTROL', start: 0.2, end: 1.4 },
            { word: 'YOUR', start: 1.4, end: 2.4 },
            { word: 'OWN', start: 2.4, end: 3.8 },
            { word: 'SOVEREIGNTY', start: 3.8, end: 7.2 }
          ]
        },
        {
          id: 'sc-4',
          order: 4,
          duration: 8,
          narration: 'Save this video to remember Seneca’s wisdom when you feel overwhelmed. Follow for daily mental mastery.',
          visualPrompt: 'Dramatic close-up of a burning torch flame illuminating dark stone tablets with ancient engraved letters',
          visualUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
          visualType: 'image',
          captionText: 'SAVE THIS & MASTER YOUR MIND',
          transition: 'dissolve',
          soundEffect: 'sfx-cinematic-riser',
          soundEffectTiming: 0.1,
          captionWords: [
            { word: 'SAVE', start: 0.2, end: 1.2 },
            { word: 'THIS', start: 1.2, end: 2.2 },
            { word: 'MASTER', start: 2.2, end: 4.0 },
            { word: 'YOUR', start: 4.0, end: 5.2 },
            { word: 'MIND', start: 5.2, end: 7.5 }
          ]
        }
      ]
    },
    {
      id: 'vid-tech-02',
      title: 'Top 3 AI Inventions That Will Shock You in 2026',
      description: 'From quantum neural interfaces to real-time holographic synthesis. Here are the 3 most groundbreaking AI breakthroughs happening right now.',
      hashtags: ['#ArtificialIntelligence', '#TechNews', '#FutureTech', '#AItools', '#Innovation'],
      niche: 'AI & Future Tech',
      topic: 'Futuristic AI tools and neural breakthroughs',
      duration: 30,
      language: 'en',
      voiceId: 'voice-alex',
      voiceEmotion: 'energetic',
      visualStyle: 'dark-cyberpunk',
      captionStyle: 'word-by-word-karaoke',
      musicTrackId: 'music-cyber-synth',
      musicVolume: 0.32,
      voiceVolume: 0.96,
      targetPlatforms: ['youtube', 'tiktok'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      status: 'scheduled',
      createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      scheduledFor: new Date(Date.now() + 3600 * 1000 * 4).toISOString(),
      totalDuration: 30,
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      watchTimeSeconds: 0,
      retentionRate: 0,
      viralScore: 89,
      scenes: [
        {
          id: 'sc-21',
          order: 1,
          duration: 6,
          narration: 'These three AI tools feel completely illegal to know, but they are 100% free.',
          visualPrompt: 'High tech glowing holographic interface floating in dark cyberpunk lab with neon cyan and magenta lights',
          visualUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          visualType: 'image',
          captionText: 'THESE AI TOOLS FEEL ILLEGAL',
          transition: 'zoom-in',
          soundEffect: 'sfx-glitch-hit',
          soundEffectTiming: 0.1,
          captionWords: [
            { word: 'THESE', start: 0.1, end: 0.8 },
            { word: 'AI', start: 0.8, end: 1.5 },
            { word: 'TOOLS', start: 1.5, end: 2.5 },
            { word: 'FEEL', start: 2.5, end: 3.5 },
            { word: 'ILLEGAL', start: 3.5, end: 5.5 }
          ]
        },
        {
          id: 'sc-22',
          order: 2,
          duration: 8,
          narration: 'First is AutoReel AI which generates full viral faceless videos in under 60 seconds with auto-captions and voiceover.',
          visualPrompt: 'Futuristic AI video synthesis supercomputer rendering glowing cinematic frames at lightspeed',
          visualUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
          visualType: 'image',
          captionText: 'AUTOREEL GENERATES FULL VIDEOS IN 60s',
          transition: 'slide-left',
          soundEffect: 'sfx-cash-register',
          soundEffectTiming: 0.1,
          captionWords: [
            { word: 'AUTOREEL', start: 0.2, end: 1.5 },
            { word: 'GENERATES', start: 1.5, end: 3.0 },
            { word: 'FULL', start: 3.0, end: 4.0 },
            { word: 'VIDEOS', start: 4.0, end: 5.5 },
            { word: 'IN 60s', start: 5.5, end: 7.5 }
          ]
        },
        {
          id: 'sc-23',
          order: 3,
          duration: 8,
          narration: 'Second is NeuralAvatar which automates custom photorealistic voice cloning in 40 languages without a microphone.',
          visualPrompt: 'Cybernetic human waveform portrait glowing with neon optical fibers and sound spectrum waves',
          visualUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
          visualType: 'image',
          captionText: 'VOICE CLONING IN 40 LANGUAGES',
          transition: 'glitch',
          soundEffect: 'sfx-whoosh-fast',
          soundEffectTiming: 0.1,
          captionWords: [
            { word: 'VOICE', start: 0.2, end: 1.2 },
            { word: 'CLONING', start: 1.2, end: 2.5 },
            { word: 'IN 40', start: 2.5, end: 4.5 },
            { word: 'LANGUAGES', start: 4.5, end: 7.2 }
          ]
        },
        {
          id: 'sc-24',
          order: 4,
          duration: 8,
          narration: 'Drop a comment with the word AI and I will send you the secret prompt toolkit for free.',
          visualPrompt: 'Glowing neon smartphone screen displaying explosive viral analytics and rocket icon',
          visualUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
          visualType: 'image',
          captionText: 'COMMENT "AI" FOR FREE TOOLKIT',
          transition: 'dissolve',
          soundEffect: 'sfx-bell-ding',
          soundEffectTiming: 0.1,
          captionWords: [
            { word: 'COMMENT', start: 0.2, end: 1.5 },
            { word: 'AI', start: 1.5, end: 3.0 },
            { word: 'FOR', start: 3.0, end: 4.0 },
            { word: 'FREE', start: 4.0, end: 5.5 },
            { word: 'TOOLKIT', start: 5.5, end: 7.5 }
          ]
        }
      ]
    }
  ],
  schedules: [
    {
      id: 'sch-01',
      projectId: 'vid-tech-02',
      projectTitle: 'Top 3 AI Inventions That Will Shock You in 2026',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      platform: 'youtube',
      scheduledTime: new Date(Date.now() + 3600 * 1000 * 4).toISOString(),
      status: 'scheduled',
      autoRetryCount: 0,
    },
    {
      id: 'sch-02',
      projectId: 'vid-tech-02',
      projectTitle: 'Top 3 AI Inventions That Will Shock You in 2026',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      platform: 'tiktok',
      scheduledTime: new Date(Date.now() + 3600 * 1000 * 6).toISOString(),
      status: 'scheduled',
      autoRetryCount: 0,
    },
    {
      id: 'sch-03',
      projectId: 'vid-stoic-01',
      projectTitle: '3 Stoic Rules That Destroy Anxiety Instantly',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      platform: 'instagram',
      scheduledTime: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      status: 'published',
      autoRetryCount: 0,
      publishedUrl: 'https://instagram.com/reel/sample1',
    }
  ],
  socialAccounts: [
    {
      id: 'acc-yt',
      platform: 'youtube',
      username: '@AutoReelMindset',
      displayName: 'Stoic Mindset Shorts',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
      connected: true,
      connectedAt: '2026-08-10T14:30:00Z',
      followersCount: 42800,
      totalUploads: 38,
      healthStatus: 'healthy',
      autoPublishEnabled: true,
    },
    {
      id: 'acc-ig',
      platform: 'instagram',
      username: 'autoreel.viral',
      displayName: 'AutoReel Viral Empire',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      connected: true,
      connectedAt: '2026-08-12T09:15:00Z',
      followersCount: 89400,
      totalUploads: 64,
      healthStatus: 'healthy',
      autoPublishEnabled: true,
    },
    {
      id: 'acc-tt',
      platform: 'tiktok',
      username: '@autoreel_official',
      displayName: 'AutoReel TikTok Factory',
      avatarUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=120&auto=format&fit=crop&q=80',
      connected: false,
      followersCount: 0,
      totalUploads: 0,
      healthStatus: 'disconnected',
      autoPublishEnabled: false,
    }
  ],
  contentPlans: []
};

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString(), aiConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

// 2. User profile & billing
app.get(['/api/user/profile', '/api/user'], (req: Request, res: Response) => {
  res.json({ success: true, user: DB.user, ...DB.user });
});

app.post('/api/user/update-plan', (req: Request, res: Response) => {
  const { plan } = req.body;
  if (['starter', 'creator-pro', 'viral-agency'].includes(plan)) {
    DB.user.plan = plan;
    if (plan === 'starter') {
      DB.user.creditsTotal = 25;
      DB.user.videosLimit = 25;
    } else if (plan === 'creator-pro') {
      DB.user.creditsTotal = 60;
      DB.user.videosLimit = 60;
    } else {
      DB.user.creditsTotal = 200;
      DB.user.videosLimit = 200;
    }
    DB.user.creditsRemaining = DB.user.creditsTotal - DB.user.videosCreatedThisMonth;
  }
  res.json({ success: true, user: DB.user });
});

// 3. AI Script & Scene Generation via Gemini
app.post('/api/gemini/generate-script', async (req: Request, res: Response) => {
  try {
    const {
      niche,
      topic,
      duration = 30,
      language = 'en',
      voiceEmotion = 'dramatic',
      visualStyle = 'cinematic-hyperrealistic',
      captionStyle = 'hormozi-bold-glow',
      musicMood = 'dark-phonk',
      platform = 'youtube'
    } = req.body;

    const ai = getGeminiClient();
    
    // Calculate recommended scenes based on duration
    const sceneCount = duration <= 15 ? 2 : duration <= 30 ? 4 : duration <= 45 ? 5 : 6;
    const sceneDuration = Math.round(duration / sceneCount);

    if (ai) {
      const prompt = `You are the world's top viral short-video producer and scriptwriter for YouTube Shorts, Instagram Reels, and TikTok.
Create a complete, high-retention, faceless short video blueprint for:
Niche: ${niche || 'General Viral'}
Topic: ${topic || 'Viral topic for ' + niche}
Duration: ${duration} seconds
Language: ${language}
Tone/Emotion: ${voiceEmotion}
Visual Style: ${visualStyle}
Caption Style: ${captionStyle}
Music Mood: ${musicMood}
Platform Target: ${platform}

Guidelines:
1. Scene 1 must be an explosive, high-converting Hook (0-3 seconds).
2. Middle scenes must deliver punchy, fast-paced value or suspense without fluff.
3. Last scene must feature a magnetic Call To Action (CTA) like "Save this video" or "Comment keyword".
4. Provide high-quality vertical 9:16 visual prompts describing cinematic scenes, lighting, and composition.
5. Provide sound effect cues (whoosh, bass-drop, glitch, bell, riser) and transitions (zoom-in, glitch, fade, slide-left, dissolve).
6. Provide word-by-word timestamp approximations for captions so karaoke sync looks crisp.

Respond strictly in JSON matching the exact schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Catchy viral title under 65 chars' },
              description: { type: Type.STRING, description: 'SEO optimized description with hook' },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5 to 8 viral hashtags starting with #' },
              viralScore: { type: Type.NUMBER, description: 'Estimated viral score between 80 and 99' },
              scenes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    order: { type: Type.INTEGER },
                    duration: { type: Type.NUMBER, description: 'Duration in seconds for this scene' },
                    narration: { type: Type.STRING, description: 'Exact spoken narration voiceover text' },
                    visualPrompt: { type: Type.STRING, description: 'Detailed visual image prompt for 9:16 vertical generation' },
                    captionText: { type: Type.STRING, description: 'Short punchy capitalized caption on screen (2-5 words)' },
                    transition: { type: Type.STRING, description: 'One of: zoom-in, fade, slide-left, glitch, dissolve, wipe' },
                    soundEffect: { type: Type.STRING, description: 'One of: sfx-whoosh-fast, sfx-bass-drop, sfx-glitch-hit, sfx-cash-register, sfx-bell-ding, sfx-cinematic-riser' },
                    captionWords: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          word: { type: Type.STRING },
                          start: { type: Type.NUMBER },
                          end: { type: Type.NUMBER }
                        },
                        required: ['word', 'start', 'end']
                      }
                    }
                  },
                  required: ['order', 'duration', 'narration', 'visualPrompt', 'captionText', 'transition']
                }
              }
            },
            required: ['title', 'description', 'hashtags', 'scenes']
          }
        }
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);

      // Enhance scenes with high-res curated background stock images matching the visual style if needed
      const stockImages = [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
      ];

      const enhancedScenes = (parsed.scenes || []).map((sc: any, idx: number) => {
        let words = sc.captionWords;
        if (!words || words.length === 0) {
          const split = (sc.captionText || sc.narration || '').split(' ');
          const step = (sc.duration || sceneDuration) / Math.max(split.length, 1);
          words = split.map((w: string, i: number) => ({
            word: w.toUpperCase(),
            start: Number((i * step).toFixed(2)),
            end: Number(((i + 1) * step).toFixed(2))
          }));
        }
        return {
          id: `sc-${Date.now()}-${idx + 1}`,
          order: idx + 1,
          duration: sc.duration || sceneDuration,
          narration: sc.narration || '',
          visualPrompt: sc.visualPrompt || `${visualStyle} scene representing ${topic}`,
          visualUrl: stockImages[idx % stockImages.length],
          visualType: 'image',
          captionText: sc.captionText || sc.narration?.slice(0, 30) || 'VIRAL MOMENT',
          captionWords: words,
          transition: sc.transition || (idx === 0 ? 'zoom-in' : 'glitch'),
          soundEffect: sc.soundEffect || (idx === 0 ? 'sfx-whoosh-fast' : 'sfx-bass-drop'),
          soundEffectTiming: 0.1
        };
      });

      // Deduct credit
      if (DB.user.creditsRemaining > 0) {
        DB.user.creditsRemaining -= 1;
        DB.user.videosCreatedThisMonth += 1;
      }

      return res.json({
        success: true,
        data: {
          title: parsed.title || `${niche}: ${topic}`,
          description: parsed.description || `Discover the secrets of ${topic}. Like and follow for more!`,
          hashtags: parsed.hashtags || ['#Viral', '#Shorts', '#Reels', '#TikTok', '#Trends'],
          viralScore: parsed.viralScore || Math.floor(Math.random() * 15) + 84,
          scenes: enhancedScenes
        }
      });
    }

    // High quality Fallback if no Gemini Key configured yet
    const fallbackScenes = Array.from({ length: sceneCount }).map((_, idx) => ({
      id: `sc-${Date.now()}-${idx + 1}`,
      order: idx + 1,
      duration: sceneDuration,
      narration: idx === 0 
        ? `Here is the one secret about ${topic || niche} that completely changes everything.` 
        : idx === sceneCount - 1 
        ? `Save this video right now and follow for daily ${niche} breakdowns!` 
        : `Most people get this wrong because they ignore the fundamental power of consistency and leverage.`,
      visualPrompt: `Cinematic 9:16 vertical render of ${topic || niche}, high detail, dramatic cinematic lighting`,
      visualUrl: idx % 2 === 0 
        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      visualType: 'image',
      captionText: idx === 0 ? 'THE UNTOLD SECRET' : idx === sceneCount - 1 ? 'SAVE THIS VIDEO NOW' : 'DO NOT IGNORE THIS',
      captionWords: [
        { word: 'THE', start: 0.2, end: 1.0 },
        { word: 'UNTOLD', start: 1.0, end: 2.2 },
        { word: 'SECRET', start: 2.2, end: 4.0 }
      ],
      transition: idx === 0 ? 'zoom-in' : 'glitch',
      soundEffect: idx === 0 ? 'sfx-whoosh-fast' : 'sfx-bass-drop',
      soundEffectTiming: 0.1
    }));

    res.json({
      success: true,
      data: {
        title: `The Ultimate Truth About ${topic || niche}`,
        description: `Everything you need to know about ${topic || niche} summarized in under ${duration} seconds. #viral #shorts`,
        hashtags: ['#AutoReel', '#Shorts', '#Reels', '#ViralTech', '#Growth'],
        viralScore: 92,
        scenes: fallbackScenes
      }
    });

  } catch (error: any) {
    console.error('Error generating script with Gemini:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate script' });
  }
});

// 4. Regenerate Single Scene via Gemini
app.post('/api/gemini/regenerate-scene', async (req: Request, res: Response) => {
  try {
    const { scene, topic, visualStyle, language = 'en', modificationType = 'all' } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are a viral short-video editor. Regenerate and improve this single scene for topic "${topic}".
Current scene details:
- Narration: "${scene.narration}"
- Visual Prompt: "${scene.visualPrompt}"
- Caption Text: "${scene.captionText}"
- Duration: ${scene.duration} seconds
- Visual Style: ${visualStyle}
- Language: ${language}
- Modification Request: ${modificationType}

Make the narration sharper, more dramatic, and visually compelling for a 9:16 vertical video.
Respond strictly in JSON with { narration, visualPrompt, captionText, captionWords, transition, soundEffect }.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              narration: { type: Type.STRING },
              visualPrompt: { type: Type.STRING },
              captionText: { type: Type.STRING },
              transition: { type: Type.STRING },
              soundEffect: { type: Type.STRING },
              captionWords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: { type: Type.STRING },
                    start: { type: Type.NUMBER },
                    end: { type: Type.NUMBER }
                  },
                  required: ['word', 'start', 'end']
                }
              }
            },
            required: ['narration', 'visualPrompt', 'captionText']
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({
        success: true,
        scene: {
          ...scene,
          ...parsed,
          id: scene.id || `sc-${Date.now()}`
        }
      });
    }

    res.json({
      success: true,
      scene: {
        ...scene,
        narration: `Upgraded insight: Never underestimate how fast small consistent leverage builds exponential results in ${topic}.`,
        captionText: 'EXPONENTIAL RESULTS FAST',
        visualPrompt: `Ultra-detailed 9:16 cinematic visual in ${visualStyle} style depicting dynamic growth of ${topic}`,
      }
    });
  } catch (error: any) {
    console.error('Error regenerating scene:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to regenerate scene' });
  }
});

// 5. AI Content Planner (7-day or 30-day bulk calendar)
app.post(['/api/gemini/content-planner', '/api/gemini/content-plan'], async (req: Request, res: Response) => {
  try {
    const { niche, totalDays = 7, days, postingFrequency = 1, platforms = ['youtube', 'tiktok', 'instagram'] } = req.body;
    const planDays = days || totalDays || 7;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are an elite viral growth strategist for short-form creators.
Generate a high-converting ${planDays}-day short-video content calendar for the niche: "${niche}".
Target Platforms: ${platforms.join(', ')}
Posting frequency: ${postingFrequency} video(s) per day (Total items: ${Math.min(planDays * postingFrequency, 30)}).

For each content idea:
- Provide day number
- Punchy viral title
- Irresistible 3-second hook
- Content angle/strategy (e.g. Controversy, Secret Reveal, Story, Tutorial, Warning)
- Best posting time (e.g. 09:30 AM, 06:15 PM)
- Estimated viral probability (80-99%)
- Recommended duration (15, 30, 45, or 60)

Respond strictly in JSON matching the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    hook: { type: Type.STRING },
                    angle: { type: Type.STRING },
                    bestPostingTime: { type: Type.STRING },
                    viralProbability: { type: Type.NUMBER },
                    suggestedDuration: { type: Type.INTEGER }
                  },
                  required: ['day', 'title', 'hook', 'angle', 'bestPostingTime', 'viralProbability', 'suggestedDuration']
                }
              }
            },
            required: ['items']
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{"items":[]}');
      const now = new Date();
      const planItems = parsed.items.map((item: any, idx: number) => {
        const itemDate = new Date(now);
        itemDate.setDate(itemDate.getDate() + (item.day - 1));
        return {
          id: `plan-item-${Date.now()}-${idx}`,
          day: item.day || idx + 1,
          date: itemDate.toISOString().split('T')[0],
          niche,
          title: item.title,
          hook: item.hook,
          angle: item.angle,
          targetPlatform: platforms,
          suggestedDuration: item.suggestedDuration || 30,
          bestPostingTime: item.bestPostingTime || '18:00',
          viralProbability: item.viralProbability || Math.floor(Math.random() * 15) + 85,
          status: 'idea'
        };
      });

      const calendarPlan = {
        id: `cal-plan-${Date.now()}`,
        niche,
        totalDays: planDays,
        postingFrequency,
        createdAt: new Date().toISOString(),
        items: planItems
      };

      DB.contentPlans.push(calendarPlan);
      return res.json({ success: true, plan: calendarPlan, items: planItems });
    }

    // Fallback Content Plan
    const fallbackItems = Array.from({ length: planDays }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() + idx);
      return {
        id: `plan-item-${Date.now()}-${idx}`,
        day: idx + 1,
        date: d.toISOString().split('T')[0],
        niche: niche || 'Stoic Wisdom',
        title: `Day ${idx + 1}: The Hidden Psychological Rule Behind ${niche || 'Success'}`,
        hook: `If you understand this one truth about ${niche || 'life'}, you will never lose sleep again...`,
        angle: idx % 2 === 0 ? 'Secret Reveal' : 'Mindset Shift',
        targetPlatform: platforms,
        suggestedDuration: 30,
        bestPostingTime: idx % 2 === 0 ? '08:30 AM' : '07:00 PM',
        viralProbability: 88 + (idx % 10),
        status: 'idea'
      };
    });

    const fallbackPlan = {
      id: `cal-plan-${Date.now()}`,
      niche: niche || 'Stoic Wisdom',
      totalDays: planDays,
      postingFrequency,
      createdAt: new Date().toISOString(),
      items: fallbackItems
    };
    DB.contentPlans.push(fallbackPlan);

    res.json({ success: true, plan: fallbackPlan, items: fallbackItems });
  } catch (error: any) {
    console.error('Error generating content plan:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate content calendar' });
  }
});

// 6. AI Analytics Insights via Gemini
app.post('/api/gemini/ai-insights', async (req: Request, res: Response) => {
  try {
    const { analyticsData } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are a world-class TikTok, Reels, and YouTube Shorts analytics consultant.
Review these creator performance metrics:
- Total Views: ${analyticsData?.totalViews || 142500}
- Average Retention: ${analyticsData?.averageRetentionRate || 88}%
- Views Growth: +${analyticsData?.viewsGrowthPercent || 24}%
- Top Niche: Stoic Wisdom & Tech Breakthroughs

Provide 4 highly specific, actionable, viral growth recommendations to double engagement and optimize hook retention in the next 14 days.
Respond in JSON with an array of strings under "insights".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['insights']
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{"insights":[]}');
      return res.json({ success: true, insights: parsed.insights });
    }

    res.json({
      success: true,
      insights: [
        'Videos with visual cuts every 2.4 seconds had a 34% higher completion rate on YouTube Shorts.',
        'Hormozi-style neon bold captions increased average watch time by 4.2 seconds compared to minimal subtitles.',
        'Posting between 6:00 PM and 8:30 PM EST yields 2.8x higher initial algorithmic velocity on TikTok and Instagram Reels.',
        'Hooks starting with "Why the top 1% never..." gained a 94% retention rate in the first 5 seconds.'
      ]
    });
  } catch (error: any) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate insights' });
  }
});

// 7. Text to Speech Endpoint (Gemini TTS `gemini-3.1-flash-tts-preview`)
app.post('/api/tts/synthesize', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore', emotion = 'dramatic' } = req.body;
    const ai = getGeminiClient();

    if (ai && text) {
      try {
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-tts-preview',
          contents: [{ parts: [{ text: `Say with ${emotion} tone: ${text}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName as any },
              },
            },
          },
        });

        const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({ success: true, audioBase64: base64Audio, format: 'pcm/24000' });
        }
      } catch (ttsErr) {
        console.warn('Gemini TTS preview call completed with fallback:', ttsErr);
      }
    }

    // Clean synthesized audio indicator
    res.json({
      success: true,
      audioBase64: null,
      message: 'Browser WebSpeech / AudioContext synthesizer will play with high fidelity voice profile.',
      voice: voiceName,
      emotion
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Videos CRUD
app.get('/api/videos', (req: Request, res: Response) => {
  res.json({ success: true, videos: DB.videos });
});

app.get('/api/videos/:id', (req: Request, res: Response) => {
  const video = DB.videos.find(v => v.id === req.params.id);
  if (!video) return res.status(404).json({ success: false, error: 'Video not found' });
  res.json({ success: true, video });
});

app.post('/api/videos', (req: Request, res: Response) => {
  const newVideo = {
    ...req.body,
    id: req.body.id || `vid-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: req.body.status || 'draft',
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0,
  };
  DB.videos.unshift(newVideo);
  res.json({ success: true, video: newVideo });
});

app.put('/api/videos/:id', (req: Request, res: Response) => {
  const index = DB.videos.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Video not found' });
  DB.videos[index] = {
    ...DB.videos[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({ success: true, video: DB.videos[index] });
});

app.delete('/api/videos/:id', (req: Request, res: Response) => {
  DB.videos = DB.videos.filter(v => v.id !== req.params.id);
  DB.schedules = DB.schedules.filter(s => s.projectId !== req.params.id);
  res.json({ success: true, message: 'Video deleted' });
});

// 9. Schedules & Auto-Publishing API
app.get('/api/schedules', (req: Request, res: Response) => {
  res.json({ success: true, schedules: DB.schedules });
});

app.post('/api/schedules', (req: Request, res: Response) => {
  const { projectId, platforms, scheduledTime } = req.body;
  const project = DB.videos.find(v => v.id === projectId);
  if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

  const newSchedules: any[] = [];
  const targetPlatforms = Array.isArray(platforms) ? platforms : ['youtube', 'instagram', 'tiktok'];

  for (const plat of targetPlatforms) {
    const item = {
      id: `sch-${Date.now()}-${plat}`,
      projectId: project.id,
      projectTitle: project.title,
      thumbnailUrl: project.thumbnailUrl,
      platform: plat,
      scheduledTime: scheduledTime || new Date(Date.now() + 3600 * 1000 * 2).toISOString(),
      status: 'scheduled',
      autoRetryCount: 0
    };
    DB.schedules.unshift(item);
    newSchedules.push(item);
  }

  project.status = 'scheduled';
  project.scheduledFor = scheduledTime;

  res.json({ success: true, schedules: newSchedules });
});

app.delete('/api/schedules/:id', (req: Request, res: Response) => {
  DB.schedules = DB.schedules.filter(s => s.id !== req.params.id);
  res.json({ success: true, message: 'Schedule removed' });
});

app.post(['/api/schedules/retry/:id', '/api/schedules/:id/retry', '/api/schedules/:id/publish'], (req: Request, res: Response) => {
  const sch = DB.schedules.find(s => s.id === req.params.id);
  if (!sch) return res.status(404).json({ success: false, error: 'Schedule not found' });
  sch.status = 'publishing';
  sch.autoRetryCount = (sch.autoRetryCount || 0) + 1;
  sch.lastAttemptAt = new Date().toISOString();

  setTimeout(() => {
    sch.status = 'published';
    sch.publishedUrl = `https://${sch.platform}.com/sample-post-${Date.now()}`;
  }, 1000);

  res.json({ success: true, schedule: sch });
});

// 10. Social Accounts & Direct Publishing
app.get(['/api/social-accounts', '/api/social/accounts', '/api/social'], (req: Request, res: Response) => {
  res.json({ success: true, accounts: DB.socialAccounts });
});

app.post(['/api/social-accounts/:platform/connect', '/api/social-accounts/connect', '/api/social/connect'], (req: Request, res: Response) => {
  const platform = req.params.platform || req.body.platform;
  const username = req.body.username;
  const account = DB.socialAccounts.find(a => a.platform === platform);
  if (account) {
    account.connected = true;
    account.username = username || account.username || `@AutoReel_${platform}`;
    account.healthStatus = 'healthy';
    account.connectedAt = new Date().toISOString();
    account.autoPublishEnabled = true;
  }
  res.json({ success: true, account, accounts: DB.socialAccounts });
});

app.post(['/api/social-accounts/:platform/disconnect', '/api/social-accounts/disconnect', '/api/social/disconnect'], (req: Request, res: Response) => {
  const platform = req.params.platform || req.body.platform;
  const account = DB.socialAccounts.find(a => a.platform === platform);
  if (account) {
    account.connected = false;
    account.healthStatus = 'disconnected';
    account.autoPublishEnabled = false;
  }
  res.json({ success: true, account, accounts: DB.socialAccounts });
});

app.post('/api/social/publish', async (req: Request, res: Response) => {
  try {
    const { videoId, platforms = ['youtube', 'instagram', 'tiktok'] } = req.body;
    const video = DB.videos.find(v => v.id === videoId);
    if (!video) return res.status(404).json({ success: false, error: 'Video not found' });

    // Simulate multi-platform official API upload with verification
    const publishedUrls: Record<string, string> = {};
    for (const plat of platforms) {
      publishedUrls[plat] = `https://${plat}.com/autoreel/viral-${Date.now().toString(36)}`;
    }

    video.status = 'published';
    video.publishedUrls = { ...video.publishedUrls, ...publishedUrls };
    video.updatedAt = new Date().toISOString();

    // Update social account stats
    for (const plat of platforms) {
      const acc = DB.socialAccounts.find(a => a.platform === plat);
      if (acc && acc.connected) {
        acc.totalUploads += 1;
      }
    }

    res.json({
      success: true,
      message: `Successfully published to ${platforms.join(', ')}!`,
      publishedUrls,
      video
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 11. Analytics Overview
app.get('/api/analytics', (req: Request, res: Response) => {
  const totalViews = DB.videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalLikes = DB.videos.reduce((sum, v) => sum + (v.likes || 0), 0);
  const totalShares = DB.videos.reduce((sum, v) => sum + (v.shares || 0), 0);
  const totalComments = DB.videos.reduce((sum, v) => sum + (v.comments || 0), 0);

  const retentionCurve = [
    { second: 0, retention: 100 },
    { second: 3, retention: 94 },
    { second: 5, retention: 89 },
    { second: 10, retention: 82 },
    { second: 15, retention: 76 },
    { second: 20, retention: 71 },
    { second: 25, retention: 68 },
    { second: 30, retention: 64 },
    { second: 45, retention: 55 },
    { second: 60, retention: 49 },
  ];

  res.json({
    success: true,
    data: {
      totalViews: totalViews || 142500,
      totalLikes: totalLikes || 12400,
      totalComments: totalComments || 640,
      totalShares: totalShares || 3120,
      totalWatchTimeHours: 128.4,
      averageRetentionRate: 88.4,
      viralScoreAverage: 91.5,
      viewsGrowthPercent: 32.8,
      platformBreakdown: {
        youtube: { views: 82400, likes: 6900, shares: 1420 },
        instagram: { views: 42100, likes: 3800, shares: 1100 },
        tiktok: { views: 18000, likes: 1700, shares: 600 },
      },
      retentionCurve,
      topVideos: DB.videos.slice(0, 5),
      aiInsights: [
        'High-contrast black/gold statue visuals generated 42% higher retention in Stoic niches.',
        'Fast 0.8s whoosh transitions between scenes decreased drop-off rate by 18%.',
        'Phonk and fast BPM beats outperformed ambient meditation music on TikTok Reels by 2.4x.'
      ]
    }
  });
});

// Explicit API 404 Handler so API routes never fall through to HTML SPA page
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `API route ${req.method} ${req.path} not found` });
});

// ==========================================
// VITE MIDDLEWARE & SERVER STARTUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoReel AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
