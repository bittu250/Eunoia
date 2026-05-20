import React from 'react';
import { useEunoia } from '@/contexts/EunoiaContext';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Globe2, Moon, Sun, Bell, Shield, LogOut, ChevronRight, Flame, Heart, BookOpen, Stethoscope, ShieldAlert, LogIn, CheckCircle2 } from 'lucide-react';

const ProfileScreen: React.FC = () => {
  const { userName, language, setLanguage, darkMode, setDarkMode, streak, moods, journals, openScreen, isAuthenticated } = useEunoia();
  const { user, signOut, setShowAuthModal } = useAuth();

  const items = [
    { icon: Stethoscope, label: 'Provider Dashboard', screen: 'provider-dashboard' as const },
    { icon: ShieldAlert, label: 'Crisis Plan', screen: 'crisis-plan' as const },
    { icon: Heart, label: 'Trusted Contacts', screen: 'trusted-contacts' as const },
    { icon: BookOpen, label: 'Healing Journey', screen: 'healing-journey' as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-rose-50 to-amber-50 dark:from-slate-950 dark:to-indigo-950 pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-4">
        {/* Profile card */}
        <div className="rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 p-6 text-white shadow-xl shadow-violet-500/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
              {userName[0]?.toUpperCase() || 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold">{userName}</h2>
              {isAuthenticated ? (
                <div className="flex items-center gap-1.5 text-violet-100 text-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="truncate">{user?.email}</span>
                </div>
              ) : (
                <p className="text-sm text-violet-100">Guest mode · sign in to save your journey</p>
              )}
            </div>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="rounded-2xl bg-white/15 backdrop-blur p-3 text-center">
              <Flame className="w-5 h-5 mx-auto" />
              <p className="text-xl font-bold mt-1">{streak}</p>
              <p className="text-[10px] text-violet-100">Day streak</p>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur p-3 text-center">
              <Heart className="w-5 h-5 mx-auto" />
              <p className="text-xl font-bold mt-1">{moods.length}</p>
              <p className="text-[10px] text-violet-100">Check-ins</p>
            </div>
            <div className="rounded-2xl bg-white/15 backdrop-blur p-3 text-center">
              <BookOpen className="w-5 h-5 mx-auto" />
              <p className="text-xl font-bold mt-1">{journals.length}</p>
              <p className="text-[10px] text-violet-100">Journals</p>
            </div>
          </div>
        </div>

        {/* Sign in CTA when not authenticated */}
        {!isAuthenticated && (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-violet-200 dark:border-violet-700 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Sign in or Sign up</h3>
                <p className="text-xs text-slate-500 mt-0.5">Securely save your moods, journals & sessions across devices</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>
        )}

        {/* Settings */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/60 shadow-sm border border-white/60 dark:border-slate-700/50 overflow-hidden">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
            {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            <span className="flex-1 text-left text-sm font-medium text-slate-900 dark:text-white">{darkMode ? 'Light mode' : 'Dark mode'}</span>
            <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-violet-500' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-4' : ''}`} />
            </div>
          </button>
          <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
            <Globe2 className="w-5 h-5 text-teal-500" />
            <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">Language</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium outline-none">
              <option>English</option><option>Nepali</option><option>Hindi</option><option>Arabic</option><option>Chinese</option>
            </select>
          </div>
          <button className="w-full border-t border-slate-100 dark:border-slate-700 flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40">
            <Bell className="w-5 h-5 text-rose-500" />
            <span className="flex-1 text-left text-sm font-medium text-slate-900 dark:text-white">Smart Reminders</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button className="w-full border-t border-slate-100 dark:border-slate-700 flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="flex-1 text-left text-sm font-medium text-slate-900 dark:text-white">Privacy & Security</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Quick links */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/60 shadow-sm border border-white/60 dark:border-slate-700/50 overflow-hidden">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <button
                key={it.label}
                onClick={() => openScreen(it.screen)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 ${i > 0 ? 'border-t border-slate-100 dark:border-slate-700' : ''}`}
              >
                <Icon className="w-5 h-5 text-violet-500" />
                <span className="flex-1 text-left text-sm font-medium text-slate-900 dark:text-white">{it.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}
        </div>

        {isAuthenticated ? (
          <button
            onClick={signOut}
            className="w-full rounded-3xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-300 p-4 font-medium text-sm flex items-center justify-center gap-2 border border-rose-100 dark:border-rose-800"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full rounded-3xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white p-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
          >
            <LogIn className="w-4 h-4" /> Sign in to Eunoia
          </button>
        )}

        <p className="text-center text-xs text-slate-400 pt-2">Eunoia v1.0 · Made with care 💜</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
