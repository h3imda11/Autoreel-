import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Flame,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface BillingViewProps {
  user: UserProfile | null;
  onUpgradePlan: (plan: string, credits: number) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ user, onUpgradePlan }) => {
  const [upgradedSuccess, setUpgradedSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Creator',
      price: '$19',
      period: '/month',
      credits: 30,
      desc: 'Perfect for solo creators launching their first faceless channel.',
      features: [
        '30 AI 9:16 Short Videos / month',
        '1080x1920 Full HD MP4 Rendering',
        'Hormozi & Karaoke Glowing Captions',
        'Standard AI Voiceover Synthesis',
        'YouTube & TikTok Direct Publishing',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Creator Pro',
      price: '$49',
      period: '/month',
      credits: 100,
      desc: 'For serious creators scaling multi-platform monetization.',
      features: [
        '100 AI 9:16 Short Videos / month',
        '4K & 1080x1920 Ultra Rendering',
        'All AI Voice Studio Emotions & Speeds',
        'AI Content Planner (30-Day Calendars)',
        'Automated Peak-Hour Scheduler Queue',
        'Cross-Platform Analytics Radar',
        'No Watermarks on any export',
      ],
      popular: true,
    },
    {
      id: 'agency',
      name: 'Agency Scale',
      price: '$149',
      period: '/month',
      credits: 400,
      desc: 'For video agencies and faceless channel empires managing 10+ accounts.',
      features: [
        '400 AI 9:16 Short Videos / month',
        'Batch 1-Click Calendar Generation',
        'Unlimited Connected Social Accounts',
        'Custom Brand Fonts & Captions',
        'Dedicated High-Speed Render Priority',
        '24/7 VIP Support & Strategy Call',
      ],
      popular: false,
    },
  ];

  const handleSelectPlan = (planId: string, credits: number) => {
    setSelectedPlan(planId);
    onUpgradePlan(planId, credits);
    setUpgradedSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => setUpgradedSuccess(false), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Credits & Subscriptions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Flexible Plans for Faceless Empires
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Scale your content production effortlessly. Upgrade anytime, cancel whenever.
        </p>
      </div>

      {upgradedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center space-x-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Plan upgraded successfully! Extra video credits deposited to your balance.</span>
        </div>
      )}

      {/* Current Usage Credit Card Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Active Plan
          </div>
          <div className="text-2xl font-black text-white flex items-center space-x-2">
            <span>Creator Pro</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Next renewal on October 15, 2026. Includes unlimited AI hook generation and 1080x1920 exports.
          </p>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-3 min-w-[240px]">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Video Credits Balance</span>
            <span className="text-rose-400 font-bold font-mono">
              {user?.creditsRemaining ?? 48} / {user?.creditsTotal ?? 60} Left
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-rose-500 to-purple-500 h-full rounded-full"
              style={{ width: `${((user?.creditsRemaining ?? 48) / (user?.creditsTotal ?? 60)) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 text-right">
            1 credit = 1 complete 9:16 video
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between space-y-6 transition-all ${
              plan.popular
                ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-rose-500 ring-2 ring-rose-500/40 shadow-2xl shadow-rose-500/10'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-4">
              {plan.popular && (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md shadow-rose-500/30">
                  <Flame className="w-3 h-3" />
                  <span>Most Popular for Creators</span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-extrabold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.desc}</p>
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-white">{plan.price}</span>
                <span className="text-xs text-slate-400">{plan.period}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-rose-400 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{plan.credits} Videos / month</span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start space-x-2 text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              id={`btn-select-plan-${plan.id}`}
              onClick={() => handleSelectPlan(plan.id, plan.credits)}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                plan.popular
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <span>Upgrade to {plan.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
