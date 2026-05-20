import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useEunoia } from '@/contexts/EunoiaContext';

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  gradient?: string;
  rightAction?: React.ReactNode;
}

const ScreenShell: React.FC<Props> = ({ title, subtitle, children, gradient = 'from-violet-100 via-sky-50 to-teal-50', rightAction }) => {
  const { closeScreen } = useEunoia();
  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br ${gradient} dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 overflow-y-auto animate-in slide-in-from-right duration-300`}>
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-white/40 dark:border-slate-700/40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={closeScreen}
            className="w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white shadow-sm flex items-center justify-center transition-all hover:scale-105"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white truncate">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>}
          </div>
          {rightAction}
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-6 pb-32">
        {children}
      </div>
    </div>
  );
};

export default ScreenShell;
