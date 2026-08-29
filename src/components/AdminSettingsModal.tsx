import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  UserPlus,
  Trash2,
  Users,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Mail,
  Zap,
  Lock,
  Search,
  Key,
  Flame
} from 'lucide-react';
import { FreeAccessEmailEntry, FreeAccessLimits } from '../types';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshUser?: () => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  onRefreshUser,
}) => {
  const [activeTab, setActiveTab] = useState<'free-emails' | 'users' | 'limits'>('free-emails');
  const [emailsList, setEmailsList] = useState<FreeAccessEmailEntry[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [freeLimits, setFreeLimits] = useState<FreeAccessLimits>({
    maxVideosPerMonth: 9999,
    maxCharsPerPrompt: 5000,
    allowCustomVoice: true,
    allowAutoYouTube: true,
    hdExport: true,
  });

  const [newEmail, setNewEmail] = useState('');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch authorized free emails
      const resEmails = await fetch('/api/admin/free-emails');
      if (resEmails.ok) {
        const dataEmails = await resEmails.json();
        if (dataEmails.success) {
          setEmailsList(dataEmails.emails || []);
          if (dataEmails.freeTierLimits) setFreeLimits(dataEmails.freeTierLimits);
        }
      } else {
        setError('Admin authorization required to view free access emails.');
      }

      // Fetch users
      const resUsers = await fetch('/api/admin/users');
      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        if (dataUsers.success) {
          setUsersList(dataUsers.users || []);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/free-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail.trim().toLowerCase(),
          note: newNote.trim() || 'Added via Admin Settings'
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setEmailsList(data.emails || []);
        setNewEmail('');
        setNewNote('');
        if (onRefreshUser) onRefreshUser();
      } else {
        setError(data.error || 'Failed to add email');
      }
    } catch (err: any) {
      setError(err.message || 'Error adding email');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEmail = async (id: string, emailStr: string) => {
    if (!confirm(`Are you sure you want to revoke 100% Free VIP Access for ${emailStr}?`)) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/admin/free-emails/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setEmailsList(data.emails || []);
        if (onRefreshUser) onRefreshUser();
      } else {
        setError(data.error || 'Failed to remove email');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting email');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLimits = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/free-limits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(freeLimits),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Free Access Tier Limits updated successfully!');
      } else {
        setError(data.error || 'Failed to update limits');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving limits');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmails = emailsList.filter(e =>
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.note?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Admin Control Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase">
                  SuperAdmin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage the Free Access Email list, inspect registered creators, and set VIP limits
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="btn-close-admin-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/30 flex space-x-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('free-emails')}
            className={`py-3.5 px-2 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'free-emails'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Free Access Email List ({emailsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`py-3.5 px-2 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'users'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Registered Users ({usersList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('limits')}
            className={`py-3.5 px-2 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'limits'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Free Tier Usage Limits</span>
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center space-x-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: FREE ACCESS EMAIL LIST */}
          {activeTab === 'free-emails' && (
            <div className="space-y-6">
              {/* Add Email Form */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Authorize New Email For 100% Free VIP Access
                  </h4>
                </div>
                <p className="text-xs text-slate-400">
                  Users with these verified email addresses bypass all credit restrictions, receiving 9,999 videos/month, custom voices, full HD rendering, and automated YouTube publishing.
                </p>

                <form onSubmit={handleAddEmail} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="Optional Note (e.g. VIP Creator)"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Grant Free Access</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Search Bar & Email Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="relative w-full max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search authorized emails..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <span className="text-xs text-slate-500">
                    Showing {filteredEmails.length} authorized addresses
                  </span>
                </div>

                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Email Address</th>
                        <th className="p-3.5">Notes</th>
                        <th className="p-3.5">Added By</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredEmails.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5 font-medium text-white flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>{item.email}</span>
                          </td>
                          <td className="p-3.5 text-slate-400">{item.note || '—'}</td>
                          <td className="p-3.5 text-slate-500">{item.addedBy}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                              100% Free VIP
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {item.email.toLowerCase() === 'sachinmurali90@gmail.com' ? (
                              <span className="text-[10px] text-slate-500 italic">Primary Admin</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRemoveEmail(item.id, item.email)}
                                className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                                title="Revoke Free Access"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredEmails.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-500">
                            No authorized emails found matching your query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTERED USERS LIST */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Creator</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Plan / VIP Status</th>
                      <th className="p-3.5">Credits Remaining</th>
                      <th className="p-3.5">Videos Created</th>
                      <th className="p-3.5">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={usr.avatar}
                              alt={usr.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-white">{usr.name}</div>
                              <div className="text-[11px] text-slate-400">{usr.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              usr.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {usr.role}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {usr.isFreeAccessUser ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                              VIP Free Access (Unlimited)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                              {usr.plan}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-rose-400">
                          {usr.isFreeAccessUser ? '∞ Unlimited' : `${usr.creditsRemaining} / ${usr.creditsTotal}`}
                        </td>
                        <td className="p-3.5 font-mono">{usr.videosCreatedThisMonth || 0}</td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(usr.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FREE TIER LIMITS */}
          {activeTab === 'limits' && (
            <form onSubmit={handleSaveLimits} className="space-y-6 max-w-xl">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-rose-400" />
                  <span>Configure VIP Free Access Limits</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Global limits automatically applied to creators whose emails exist in the Free Access Email List.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max Short Videos Per Month
                    </label>
                    <input
                      type="number"
                      value={freeLimits.maxVideosPerMonth}
                      onChange={(e) => setFreeLimits({ ...freeLimits, maxVideosPerMonth: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max Characters in Topic & Niche Box
                    </label>
                    <input
                      type="number"
                      value={freeLimits.maxCharsPerPrompt}
                      onChange={(e) => setFreeLimits({ ...freeLimits, maxCharsPerPrompt: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={freeLimits.allowCustomVoice}
                        onChange={(e) => setFreeLimits({ ...freeLimits, allowCustomVoice: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-rose-500"
                      />
                      <span>Allow Expressive Custom AI Voice Settings & Emotions</span>
                    </label>

                    <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={freeLimits.allowAutoYouTube}
                        onChange={(e) => setFreeLimits({ ...freeLimits, allowAutoYouTube: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-rose-500"
                      />
                      <span>Allow 1-Click Automated YouTube Shorts Publishing</span>
                    </label>

                    <label className="flex items-center space-x-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={freeLimits.hdExport}
                        onChange={(e) => setFreeLimits({ ...freeLimits, hdExport: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-rose-500"
                      />
                      <span>Allow 1080x1920 60FPS Master Export without Watermark</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Save Free Tier Limits
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
