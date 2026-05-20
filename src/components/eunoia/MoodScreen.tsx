import React, { useState } from 'react';
import { useEunoia } from '@/contexts/EunoiaContext';
import { Plus, TrendingUp, Calendar, Sparkles } from 'lucide-react';

const moods = [
  { mood: 'Happy', emoji: '😊', color: 'from-amber-300 to-orange-400' },
  { mood: 'Calm', emoji: '😌', color: 'from-teal-300 to-emerald-400' },
  { mood: 'Sad', emoji: '😔', color: 'from-blue-300 to-indigo-400' },
  { mood: 'Anxious', emoji: '😰', color: 'from-violet-300 to-purple-400' },
  { mood: 'Angry', emoji: '😡', color: 'from-rose-400 to-red-500' },
  { mood: 'Exhausted', emoji: '😴', color: 'from-slate-300 to-slate-500' },
  { mood: 'Lonely', emoji: '😞', color: 'from-indigo-300 to-violet-400' },
];

const triggers = ['Work', 'Family', 'Exam', 'Sleep', 'Money', 'Health', 'Relationship', 'Loneliness', 'News'];

const MoodScreen: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const { moods: history, addMood } = useEunoia();
  const [step, setStep] = useState<'select' | 'detail' | 'done'>('select');
  const [picked, setPicked] = useState<typeof moods[0] | null>(null);
  const [stress, setStress] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const submit = () => {
    if (!picked) return;
    addMood({ mood: picked.mood, emoji: picked.emoji, stress, triggers: selectedTriggers, note });
    setStep('done');
    setTimeout(() => {
      setStep('select');
      setPicked(null);
      setStress(5);
      setSelectedTriggers([]);
      setNote('');
    }, 2500);
  };

  // Chart data — last 7 days stress
  const last7 = history.slice(-7);
  const maxStress = 10;

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} bg-gradient-to-b from-rose-50 via-violet-50 to-sky-50 dark:from-slate-950 dark:to-indigo-950 pb-24`}>
      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-rose-500 font-semibold">Mood Tracker</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">How are you feeling?</h1>
          <p className="text-sm text-slate-500 mt-1">Take a moment. There's no wrong answer.</p>
        </div>

        {/* Check-in card */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/60 p-5 shadow-sm border border-white/60 dark:border-slate-700/50">
          {step === 'select' && (
            <>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Today's emotion</h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {moods.map(m => (
                  <button
                    key={m.mood}
                    onClick={() => { setPicked(m); setStep('detail'); }}
                    className={`group p-3 rounded-2xl bg-gradient-to-br ${m.color} text-white flex flex-col items-center gap-1 hover:scale-110 transition-transform shadow-md`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[10px] font-medium">{m.mood}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 'detail' && picked && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${picked.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {picked.emoji}
                </div>
                <div>
                  <p className="text-xs text-slate-500">Feeling</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{picked.mood}</p>
                </div>
              </div>

              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Stress level: {stress}/10</label>
              <input type="range" min={1} max={10} value={stress} onChange={(e) => setStress(+e.target.value)} className="w-full accent-violet-500" />

              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mt-4 mb-2">What's contributing?</label>
              <div className="flex flex-wrap gap-2">
                {triggers.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTriggers(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedTriggers.includes(t)
                        ? 'bg-violet-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A few words about today (optional)…"
                rows={3}
                className="w-full mt-4 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-violet-400 resize-none"
              />

              <div className="flex gap-2 mt-4">
                <button onClick={() => setStep('select')} className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium">Back</button>
                <button onClick={submit} className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/30">Save</button>
              </div>
            </>
          )}
          {step === 'done' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mx-auto flex items-center justify-center text-3xl">✨</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-3">Saved with care</h3>
              <p className="text-sm text-slate-500 mt-1">Your feelings matter. Thank you for checking in.</p>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/60 p-5 shadow-sm border border-white/60 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Stress over time</h3>
              <p className="text-xs text-slate-500">Last 7 entries</p>
            </div>
            <TrendingUp className="w-5 h-5 text-violet-500" />
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {last7.map((m, i) => (
              <div key={m.id} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs">{m.emoji}</div>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-violet-500 to-pink-400 transition-all hover:opacity-80"
                  style={{ height: `${(m.stress / maxStress) * 90}%` }}
                  title={`${m.mood} · stress ${m.stress}`}
                />
                <span className="text-[10px] text-slate-500">{new Date(m.timestamp).toLocaleDateString(undefined, { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-3xl bg-white dark:bg-slate-800/60 p-5 shadow-sm border border-white/60 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent timeline</h3>
            <Calendar className="w-5 h-5 text-violet-500" />
          </div>
          <div className="space-y-2">
            {[...history].reverse().slice(0, 6).map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <div className="text-2xl">{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{m.mood}{m.triggers.length > 0 && <span className="text-xs text-slate-500 font-normal"> · {m.triggers.join(', ')}</span>}</p>
                  {m.note && <p className="text-xs text-slate-500 truncate">{m.note}</p>}
                </div>
                <span className="text-xs text-slate-400">{new Date(m.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 p-5 text-white shadow-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Eunoia's reflection</h3>
              <p className="text-sm text-violet-100 mt-1 leading-relaxed">
                Your recent entries show emotional ups and downs — that's completely human. The breathing and check-in habits are helping. Would you like a gentle grounding exercise?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodScreen;
