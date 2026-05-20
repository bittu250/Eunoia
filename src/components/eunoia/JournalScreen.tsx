import React, { useState } from 'react';
import { useEunoia } from '@/contexts/EunoiaContext';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Mic, Sparkles, BookHeart } from 'lucide-react';

const JournalScreen: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const { journals, addJournal } = useEunoia();
  const [composing, setComposing] = useState(false);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const save = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    let sentiment = 'neutral', emotions: string[] = [], insight = 'Thank you for taking time to reflect.';
    try {
      const { data } = await supabase.functions.invoke('eunoia-ai-chat', {
        body: {
          messages: [{ role: 'user', content: text }],
          mode: 'journal',
        }
      });
      try {
        const cleaned = data.reply.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        sentiment = parsed.sentiment || sentiment;
        emotions = parsed.emotions || [];
        insight = parsed.insight || insight;
      } catch {}
    } catch {}
    addJournal({ text, sentiment, emotions, insight });
    setText('');
    setComposing(false);
    setAnalyzing(false);
  };

  const startVoice = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported'); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    let final = '';
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
        else interim += e.results[i][0].transcript;
      }
      setText(final + interim);
    };
    rec.start();
    setTimeout(() => rec.stop(), 30000);
  };

  const filtered = journals.filter(j => j.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} bg-gradient-to-b from-amber-50 via-rose-50 to-violet-50 dark:from-slate-950 dark:to-indigo-950 pb-28`}>
      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-rose-500 font-semibold">Journal</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your inner space</h1>
          </div>
          <button
            onClick={() => setComposing(true)}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your reflections…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-violet-400"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white dark:bg-slate-800/60 p-3 border border-white/60 dark:border-slate-700/50">
            <p className="text-xs text-slate-500">Entries</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{journals.length}</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-800/60 p-3 border border-white/60 dark:border-slate-700/50">
            <p className="text-xs text-slate-500">Positive</p>
            <p className="text-xl font-bold text-emerald-600">{journals.filter(j => j.sentiment === 'positive').length}</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-800/60 p-3 border border-white/60 dark:border-slate-700/50">
            <p className="text-xs text-slate-500">Trend</p>
            <p className="text-xl font-bold text-violet-600">Healing</p>
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 rounded-3xl bg-white/60 dark:bg-slate-800/40 border-2 border-dashed border-slate-200 dark:border-slate-700">
              <BookHeart className="w-10 h-10 text-rose-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No entries match. Start writing to begin.</p>
            </div>
          )}
          {filtered.map(j => (
            <div key={j.id} className="rounded-3xl bg-white dark:bg-slate-800/60 p-5 shadow-sm border border-white/60 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{new Date(j.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                {j.sentiment && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    j.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                    j.sentiment === 'negative' ? 'bg-rose-100 text-rose-700' :
                    j.sentiment === 'mixed' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>{j.sentiment}</span>
                )}
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">{j.text}</p>
              {j.emotions && j.emotions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {j.emotions.map(e => (
                    <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">{e}</span>
                  ))}
                </div>
              )}
              {j.insight && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-violet-700 dark:text-violet-300 italic leading-relaxed">{j.insight}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compose modal */}
      {composing && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">New entry</h3>
            <p className="text-xs text-slate-500 mb-3">Write freely. Eunoia will reflect with you.</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              rows={8}
              placeholder="What happened today? How did it feel?"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-violet-400 resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setComposing(false)} className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium">Cancel</button>
              <button onClick={startVoice} className="px-4 py-2.5 rounded-2xl bg-violet-100 text-violet-700 text-sm font-medium flex items-center gap-1.5"><Mic className="w-4 h-4" /> Voice</button>
              <button onClick={save} disabled={!text.trim() || analyzing} className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold shadow-lg disabled:opacity-50">{analyzing ? 'Reflecting…' : 'Save & reflect'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalScreen;
