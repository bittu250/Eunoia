import React from 'react';
import {
  Home,
  Sparkles,
  Activity,
  BookHeart,
  Stethoscope,
  User,
} from 'lucide-react';

import { useEunoia } from '@/contexts/EunoiaContext';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'chat', label: 'AI Chat', icon: Sparkles },
  { id: 'mood', label: 'Mood', icon: Activity },
  { id: 'journal', label: 'Journal', icon: BookHeart },
  { id: 'therapy', label: 'Therapy', icon: Stethoscope },
  { id: 'profile', label: 'Profile', icon: User },
] as const;

const BottomTabs: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    closeAll,
    openScreen,
  } = useEunoia();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-white/80 dark:bg-slate-900/85 border-t border-white/40 dark:border-slate-700/40">
      <div className="max-w-3xl mx-auto px-2 py-2 flex items-center justify-around">
        {tabs.map((t) => {
          const Icon = t.icon;

          const active =
            currentTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => {
                closeAll();

                if (t.id === 'therapy') {
                  openScreen('human-support');
                } else {
                  setCurrentTab(t.id as any);
                }
              }}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-2xl transition-all ${
                active
                  ? 'text-violet-600 dark:text-violet-300'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40 scale-110'
                    : ''
                }`}
              >
                <Icon
                  className="w-5 h-5"
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>

              <span
                className={`text-[10px] font-medium ${
                  active ? 'font-semibold' : ''
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabs;