import React from 'react';
import { useEunoia, ScreenId } from '@/contexts/EunoiaContext';
import {
  Sparkles, ClipboardCheck, Wind, Flower2, Coffee,
  Activity, TrendingUp, FileText, RefreshCw,
  Brain, BookHeart, HeartHandshake, Moon, Anchor,
  Stethoscope, Video, Headphones, Phone, Store,
  ShieldAlert, LifeBuoy, Users2, Map,
  UsersRound, Trophy, Compass, Sprout, Flame
} from 'lucide-react';

interface FeatureCard {
  id: ScreenId;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
}

const sections: { title: string; tag: string; cards: FeatureCard[] }[] = [
  {
    title: 'Daily Support',
    tag: 'For your everyday',
    cards: [
      { id: 'ai-companion', title: 'AI Companion', subtitle: 'Talk anytime', icon: Sparkles, gradient: 'from-violet-400 to-fuchsia-400' },
      { id: 'check-in', title: 'Smart Check-In', subtitle: '2-min reflection', icon: ClipboardCheck, gradient: 'from-sky-400 to-cyan-400' },
      { id: 'breathing', title: 'Breathing', subtitle: 'Calm in 4 mins', icon: Wind, gradient: 'from-teal-400 to-emerald-400' },
      { id: 'meditation', title: 'Meditation', subtitle: 'Guided sessions', icon: Flower2, gradient: 'from-amber-300 to-orange-400' },
      { id: 'quick-relax', title: 'Quick Relax', subtitle: '60-second reset', icon: Coffee, gradient: 'from-rose-300 to-pink-400' },
    ],
  },
  {
    title: 'Track Your Mind',
    tag: 'Self-awareness',
    cards: [
      { id: 'mood-tracker', title: 'Mood Tracking', subtitle: 'Daily check-ins', icon: Activity, gradient: 'from-pink-400 to-rose-500' },
      { id: 'trends', title: 'Emotional Trends', subtitle: 'See your patterns', icon: TrendingUp, gradient: 'from-indigo-400 to-violet-500' },
      { id: 'assessments', title: 'Assessments', subtitle: 'PHQ-9, GAD-7, more', icon: FileText, gradient: 'from-blue-400 to-indigo-500' },
      { id: 'recovery', title: 'Recovery', subtitle: 'Healing timeline', icon: RefreshCw, gradient: 'from-emerald-400 to-teal-500' },
    ],
  },
  {
    title: 'Self Help',
    tag: 'Tools you control',
    cards: [
      { id: 'cbt', title: 'CBT Tools', subtitle: 'Reframe thoughts', icon: Brain, gradient: 'from-purple-400 to-indigo-500' },
      { id: 'journal', title: 'Journaling', subtitle: 'Write & reflect', icon: BookHeart, gradient: 'from-rose-400 to-pink-500' },
      { id: 'gratitude', title: 'Gratitude', subtitle: '3 things daily', icon: HeartHandshake, gradient: 'from-amber-400 to-yellow-500' },
      { id: 'sleep', title: 'Sleep Tools', subtitle: 'Better rest', icon: Moon, gradient: 'from-slate-500 to-indigo-600' },
      { id: 'grounding', title: 'Grounding', subtitle: '5-4-3-2-1 method', icon: Anchor, gradient: 'from-teal-400 to-cyan-500' },
    ],
  },
  {
    title: 'Human Support',
    tag: 'Real connection',
    cards: [
      { id: 'find-therapist', title: 'Find Therapist', subtitle: 'Licensed experts', icon: Stethoscope, gradient: 'from-blue-500 to-cyan-500' },
      { id: 'telemedicine', title: 'Telemedicine', subtitle: 'Remote care', icon: Video, gradient: 'from-violet-500 to-purple-600' },
      { id: 'audio-session', title: 'Audio Session', subtitle: 'Voice-only', icon: Headphones, gradient: 'from-emerald-500 to-teal-600' },
      { id: 'video-session', title: 'Video Session', subtitle: 'Face-to-face', icon: Phone, gradient: 'from-pink-500 to-rose-600' },
      { id: 'marketplace', title: 'Marketplace', subtitle: 'Browse providers', icon: Store, gradient: 'from-indigo-500 to-blue-600' },
    ],
  },
  {
    title: 'Safety & Crisis',
    tag: 'Help when needed',
    cards: [
      { id: 'emergency', title: 'Emergency Help', subtitle: 'Immediate support', icon: ShieldAlert, gradient: 'from-red-500 to-rose-600' },
      { id: 'suicide-support', title: 'Suicide Support', subtitle: '24/7 hotlines', icon: LifeBuoy, gradient: 'from-orange-500 to-red-500' },
      { id: 'trusted-contacts', title: 'Trusted Contacts', subtitle: 'Your safe people', icon: Users2, gradient: 'from-amber-500 to-orange-600' },
      { id: 'crisis-plan', title: 'Crisis Plan', subtitle: 'Be prepared', icon: Map, gradient: 'from-rose-500 to-pink-600' },
    ],
  },
  {
    title: 'Community & Growth',
    tag: 'Together we heal',
    cards: [
      { id: 'support-groups', title: 'Support Groups', subtitle: 'You\'re not alone', icon: UsersRound, gradient: 'from-cyan-400 to-blue-500' },
      { id: 'challenges', title: 'Challenges', subtitle: '7-day journeys', icon: Trophy, gradient: 'from-yellow-400 to-orange-500' },
      { id: 'healing-journey', title: 'Healing Journey', subtitle: 'Your path', icon: Compass, gradient: 'from-emerald-400 to-green-500' },
      { id: 'growth', title: 'Emotional Growth', subtitle: 'Level up', icon: Sprout, gradient: 'from-lime-400 to-green-500' },
    ],
  },
];

const HomeScreen: React.FC = () => {
  const { openScreen, userName, streak, moods } = useEunoia();
  const lastMood = moods[moods.length - 1];
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-sky-50 to-rose-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/6a06f62ecbc5fc58306f4125_1778841332396_a8d9aa9c.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/60 to-white dark:from-slate-950/40 dark:via-slate-950/70 dark:to-slate-950" />
        <div className="relative max-w-4xl mx-auto px-5 pt-10 pb-8">
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{greeting}, {userName}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1 leading-tight">
            How is your heart<br />feeling today?
          </h1>
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              onClick={() => openScreen('check-in')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-medium shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform"
            >
              Start Check-In
            </button>
            <button
              onClick={() => openScreen('ai-companion')}
              className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur text-slate-800 dark:text-white text-sm font-medium shadow-sm hover:scale-105 transition-transform border border-white/60"
            >
              Talk to Eunoia
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div onClick={() => openScreen('mood-tracker')} className="cursor-pointer rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur p-3 border border-white/60 hover:scale-105 transition-transform">
              <div className="flex items-center gap-1 text-orange-500"><Flame className="w-4 h-4" /><span className="text-xs font-semibold">Streak</span></div>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{streak} days</p>
            </div>
            <div onClick={() => openScreen('mood-tracker')} className="cursor-pointer rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur p-3 border border-white/60 hover:scale-105 transition-transform">
              <p className="text-xs font-semibold text-slate-500">Last mood</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{lastMood?.emoji} {lastMood?.mood}</p>
            </div>
            <div onClick={() => openScreen('assessments')} className="cursor-pointer rounded-2xl bg-white/70 dark:bg-slate-800/60 backdrop-blur p-3 border border-white/60 hover:scale-105 transition-transform">
              <p className="text-xs font-semibold text-slate-500">Wellness</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">Good</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-4 space-y-7 mt-2">
        {sections.map(section => (
          <section key={section.title}>
            <div className="flex items-end justify-between px-1 mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-violet-500 dark:text-violet-300 font-semibold">{section.tag}</p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {section.cards.map(card => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => openScreen(card.id)}
                    className="group relative text-left rounded-3xl bg-white dark:bg-slate-800/60 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/60 dark:border-slate-700/50 overflow-hidden active:scale-95"
                  >
                    <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg mb-3`}>
                      <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{card.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{card.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Disclaimer */}
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 mt-8">
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Note:</strong> Eunoia provides emotional wellness support and is not a replacement for licensed medical or psychiatric care. In a crisis, please reach out to a trusted person or a crisis helpline.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
