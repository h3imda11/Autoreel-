import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CreateVideoView } from './components/CreateVideoView';
import { VideoEditorView } from './components/VideoEditorView';
import { MyVideosView } from './components/MyVideosView';
import { ContentPlannerView } from './components/ContentPlannerView';
import { SchedulerView } from './components/SchedulerView';
import { SocialAccountsView } from './components/SocialAccountsView';
import { TemplatesView } from './components/TemplatesView';
import { VoiceStudioView } from './components/VoiceStudioView';
import { MusicLibraryView } from './components/MusicLibraryView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { BillingView } from './components/BillingView';
import { PublishModal } from './components/PublishModal';
import { AuthModal } from './components/AuthModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { VideoProject, ScheduledPost, SocialAccount, UserProfile, PlatformType, ContentPlanItem } from './types';

export function App() {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Core Data Stores
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [schedules, setSchedules] = useState<ScheduledPost[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Active Editor state
  const [activeVideoForEditor, setActiveVideoForEditor] = useState<VideoProject | null>(null);

  // Quick Prefill for Create Video (from Dashboard / Templates / Planner)
  const [createPrefill, setCreatePrefill] = useState<{ niche: string; prompt: string }>({
    niche: 'Stoic Wisdom & Quotes',
    prompt: '',
  });

  // Modal State
  const [publishModal, setPublishModal] = useState<{
    open: boolean;
    mode: 'publish' | 'schedule';
    video: VideoProject | null;
  }>({
    open: false,
    mode: 'publish',
    video: null,
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Fetch initial data from backend APIs
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const safeFetchJson = async (url: string) => {
        try {
          const res = await fetch(url);
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            return await res.json();
          }
        } catch (err) {
          console.warn(`Failed to fetch ${url}:`, err);
        }
        return null;
      };

      const [vData, sData, soData, uData] = await Promise.all([
        safeFetchJson('/api/videos'),
        safeFetchJson('/api/schedules'),
        safeFetchJson('/api/social-accounts'),
        safeFetchJson('/api/user/profile'),
      ]);

      if (vData && vData.success && Array.isArray(vData.videos)) {
        setVideos(vData.videos);
      }
      if (sData && sData.success && Array.isArray(sData.schedules)) {
        setSchedules(sData.schedules);
      }
      if (soData && soData.success && Array.isArray(soData.accounts)) {
        setSocialAccounts(soData.accounts);
      }
      if (uData) {
        if (uData.success && uData.user) {
          setUser(uData.user);
        } else if (uData.id && uData.name) {
          setUser(uData);
        }
      }
    } catch (e) {
      console.error('Failed to load initial data from server:', e);
    }
  };

  // Actions
  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVideo = (video: VideoProject) => {
    setActiveVideoForEditor(video);
    setActivePage('editor');
  };

  const handleQuickGenerate = (niche: string, prompt: string) => {
    setCreatePrefill({ niche, prompt });
    setActivePage('create');
  };

  const handleVideoCreated = (video: VideoProject) => {
    setVideos((prev) => [video, ...prev.filter((v) => v.id !== video.id)]);
    setActiveVideoForEditor(video);
    setActivePage('editor');
  };

  const handleSaveProject = (updated: VideoProject) => {
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setActiveVideoForEditor(updated);
    fetch(`/api/videos/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(console.error);
  };

  const handleDeleteVideo = async (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (activeVideoForEditor?.id === id) {
      setActiveVideoForEditor(null);
      setActivePage('videos');
    }
    fetch(`/api/videos/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const handleOpenPublishModal = (video: VideoProject) => {
    setPublishModal({ open: true, mode: 'publish', video });
  };

  const handleOpenScheduleModal = (video: VideoProject) => {
    setPublishModal({ open: true, mode: 'schedule', video });
  };

  const handleConfirmPublish = async (video: VideoProject, platforms: PlatformType[]) => {
    const updated = { ...video, status: 'published' as const };
    handleSaveProject(updated);

    // Create published schedule records
    for (const p of platforms) {
      const newPost: ScheduledPost = {
        id: `pub-${Date.now()}-${p}`,
        projectId: video.id,
        projectTitle: video.title,
        thumbnailUrl: video.thumbnailUrl,
        platform: p,
        scheduledTime: new Date().toISOString(),
        status: 'published',
        caption: `${video.title} ${video.hashtags?.join(' ') || ''}`,
      };
      setSchedules((prev) => [newPost, ...prev]);
      fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      }).catch(console.error);
    }
  };

  const handleConfirmSchedule = async (
    video: VideoProject,
    platforms: PlatformType[],
    scheduledTime: string
  ) => {
    const updated = { ...video, status: 'scheduled' as const };
    handleSaveProject(updated);

    for (const p of platforms) {
      const newPost: ScheduledPost = {
        id: `sch-${Date.now()}-${p}`,
        projectId: video.id,
        projectTitle: video.title,
        thumbnailUrl: video.thumbnailUrl,
        platform: p,
        scheduledTime,
        status: 'scheduled',
        caption: `${video.title} ${video.hashtags?.join(' ') || ''}`,
      };
      setSchedules((prev) => [newPost, ...prev]);
      fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      }).catch(console.error);
    }
  };

  const handleTriggerInstantPublish = async (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === scheduleId ? { ...s, status: 'published' } : s))
    );
    fetch(`/api/schedules/${scheduleId}/publish`, { method: 'POST' }).catch(console.error);
  };

  const handleCancelSchedule = async (scheduleId: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    fetch(`/api/schedules/${scheduleId}`, { method: 'DELETE' }).catch(console.error);
  };

  const handleBatchSchedulePlan = (items: ContentPlanItem[]) => {
    // Generate automated schedule queue for all days
    const newItems: ScheduledPost[] = items.map((item, idx) => ({
      id: `batch-${Date.now()}-${idx}`,
      projectId: `proj-planned-${idx}`,
      projectTitle: `${item.topic} (${item.hook})`,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
      platform: 'youtube',
      scheduledTime: new Date(Date.now() + (idx + 1) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      caption: `🔥 ${item.topic} - ${item.hook} #shorts #viral #mindset`,
    }));

    setSchedules((prev) => [...newItems, ...prev]);
    setActivePage('scheduler');
  };

  const handleToggleSocialConnect = (platform: PlatformType) => {
    setSocialAccounts((prev) =>
      prev.map((acc) =>
        acc.platform === platform ? { ...acc, connected: !acc.connected } : acc
      )
    );
    fetch(`/api/social-accounts/${platform}/connect`, { method: 'POST' }).catch(console.error);
  };

  const handleUpgradePlan = (plan: string, addedCredits: number) => {
    if (user) {
      setUser({
        ...user,
        plan: plan as any,
        creditsRemaining: user.creditsRemaining + addedCredits,
        creditsTotal: user.creditsTotal + addedCredits,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      fetchInitialData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAuthSuccess = (authedUser: UserProfile) => {
    setUser(authedUser);
    setIsAuthModalOpen(false);
    fetchInitialData();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans antialiased transition-colors duration-200`}>
      {/* Top Universal Navbar */}
      <Header
        user={user}
        activePage={activePage}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Left Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        </div>

        {/* Main Central View Container */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          {activePage === 'dashboard' && (
            <DashboardView
              videos={videos}
              schedules={schedules}
              onNavigate={handleNavigate}
              onSelectVideo={handleSelectVideo}
              onQuickGenerate={handleQuickGenerate}
            />
          )}

          {activePage === 'create' && (
            <CreateVideoView
              initialNiche={createPrefill.niche}
              initialPrompt={createPrefill.prompt}
              onVideoCreated={handleVideoCreated}
            />
          )}

          {activePage === 'editor' && activeVideoForEditor && (
            <VideoEditorView
              project={activeVideoForEditor}
              onBack={() => handleNavigate('videos')}
              onSaveProject={handleSaveProject}
              onPublishNow={handleOpenPublishModal}
              onSchedulePost={handleOpenScheduleModal}
            />
          )}

          {activePage === 'videos' && (
            <MyVideosView
              videos={videos}
              onSelectVideo={handleSelectVideo}
              onCreateNew={() => handleNavigate('create')}
              onPublishNow={handleOpenPublishModal}
              onSchedulePost={handleOpenScheduleModal}
              onDeleteVideo={handleDeleteVideo}
            />
          )}

          {activePage === 'planner' && (
            <ContentPlannerView
              onGenerateFromIdea={handleQuickGenerate}
              onBatchSchedule={handleBatchSchedulePlan}
            />
          )}

          {activePage === 'scheduler' && (
            <SchedulerView
              schedules={schedules}
              videos={videos}
              onTriggerPublish={handleTriggerInstantPublish}
              onCancelSchedule={handleCancelSchedule}
              onNavigateToCreate={() => handleNavigate('create')}
            />
          )}

          {activePage === 'social' && (
            <SocialAccountsView
              accounts={socialAccounts}
              onToggleConnect={handleToggleSocialConnect}
            />
          )}

          {activePage === 'templates' && (
            <TemplatesView onUseTemplate={handleQuickGenerate} />
          )}

          {activePage === 'voices' && <VoiceStudioView />}

          {activePage === 'music' && <MusicLibraryView />}

          {activePage === 'analytics' && <AnalyticsView videos={videos} />}

          {activePage === 'settings' && (
            <SettingsView
              user={user}
              onSavePreferences={(prefs) => console.log('Saved preferences', prefs)}
            />
          )}

          {activePage === 'billing' && (
            <BillingView user={user} onUpgradePlan={handleUpgradePlan} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around z-40 px-2">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'create', label: 'Create' },
          { id: 'videos', label: 'Videos' },
          { id: 'planner', label: 'Planner' },
          { id: 'scheduler', label: 'Schedule' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`flex flex-col items-center justify-center text-[10px] font-bold py-1 px-2 rounded-lg transition-colors ${
              activePage === item.id ? 'text-rose-400 font-extrabold' : 'text-slate-400'
            }`}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 1-Click Publish & Schedule Modal */}
      {publishModal.open && (
        <PublishModal
          video={publishModal.video}
          mode={publishModal.mode}
          onClose={() => setPublishModal({ open: false, mode: 'publish', video: null })}
          onConfirmPublish={handleConfirmPublish}
          onConfirmSchedule={handleConfirmSchedule}
        />
      )}

      {/* Auth Modal (Sign Up, Sign In, Google Sign-In, Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Admin Settings & Free Email Access Manager */}
      <AdminSettingsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onRefreshUser={fetchInitialData}
      />
    </div>
  );
}

export default App;
