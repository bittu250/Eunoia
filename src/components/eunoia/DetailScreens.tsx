import React, { useState, useEffect, useRef } from 'react';
import ScreenShell from './ScreenShell';
import { useEunoia } from '@/contexts/EunoiaContext';
import { Phone, Star, Video, MessageSquare, Calendar, CheckCircle2, Wind, Flame, Heart, Brain, Moon, Anchor, Trophy, Users2, Plus, Trash2, AlertCircle, Play, Pause } from 'lucide-react';

// --- BREATHING ---
export const BreathingScreen: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [count, setCount] = useState(4);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!running) return;
    const phases = { inhale: 4, hold: 7, exhale: 8, rest: 1 };
    const order: typeof phase[] = ['inhale', 'hold', 'exhale', 'rest'];
    let p = phase;
    setCount(phases[p]);
    const interval = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          const next = order[(order.indexOf(p) + 1) % order.length];
          p = next;
          setPhase(next);
          if (next === 'inhale') setCycle(x => x + 1);
          return phases[next];
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const sizes = { inhale: 'scale-150', hold: 'scale-150', exhale: 'scale-75', rest: 'scale-75' };

  return (
    <ScreenShell title="4-7-8 Breathing" subtitle="A calming technique for anxiety" gradient="from-teal-100 via-cyan-50 to-sky-100">
      <div className="text-center py-8">
        <div className="relative h-72 flex items-center justify-center">
          <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-teal-400 via-cyan-400 to-sky-400 transition-transform duration-[3000ms] ease-in-out ${sizes[phase]} flex items-center justify-center shadow-2xl shadow-cyan-400/40`}>
            <div className="text-center text-white">
              <p className="text-sm uppercase tracking-wider opacity-90">{phase}</p>
              <p className="text-5xl font-bold">{count}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-6">Cycles completed: <strong>{cycle}</strong></p>
        <button
          onClick={() => setRunning(r => !r)}
          className="mt-6 px-8 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-lg shadow-teal-500/30 hover:scale-105 transition-transform"
        >
          {running ? 'Pause' : 'Begin'}
        </button>
        <p className="text-xs text-slate-500 mt-8 max-w-md mx-auto leading-relaxed">
          Inhale through your nose for 4 seconds, hold for 7, exhale through your mouth for 8. This activates your parasympathetic nervous system — your body's natural calm.
        </p>
      </div>
    </ScreenShell>
  );
};

// --- MEDITATION ---
export const MeditationScreen: React.FC = () => {
  const sessions = [
    { title: 'Body Scan', duration: '10 min', desc: 'Release tension from head to toe', color: 'from-violet-400 to-purple-500' },
    { title: 'Loving Kindness', duration: '8 min', desc: 'Send compassion to yourself & others', color: 'from-rose-400 to-pink-500' },
    { title: 'Anxious Mind', duration: '12 min', desc: 'Soothe a racing mind', color: 'from-sky-400 to-blue-500' },
    { title: 'Sleep Drift', duration: '20 min', desc: 'Gentle path into rest', color: 'from-indigo-500 to-slate-600' },
    { title: 'Morning Light', duration: '5 min', desc: 'Begin with intention', color: 'from-amber-400 to-orange-500' },
    { title: 'Grief Hold', duration: '15 min', desc: 'Hold heavy feelings gently', color: 'from-teal-400 to-emerald-500' },
  ];
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <ScreenShell title="Meditation Library" subtitle="Guided sessions for every emotion">
      <div className="grid sm:grid-cols-2 gap-3">
        {sessions.map(s => (
          <div key={s.title} className={`rounded-3xl bg-gradient-to-br ${s.color} p-5 text-white shadow-lg`}>
            <p className="text-xs uppercase tracking-wider opacity-80">{s.duration}</p>
            <h3 className="text-lg font-bold mt-1">{s.title}</h3>
            <p className="text-sm text-white/85 mt-1">{s.desc}</p>
            <button
              onClick={() => setPlaying(p => p === s.title ? null : s.title)}
              className="mt-3 w-10 h-10 rounded-full bg-white/25 backdrop-blur hover:bg-white/40 flex items-center justify-center"
            >
              {playing === s.title ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
};

// --- ASSESSMENTS ---
const assessments = {
  'PHQ-9': {
    desc: 'Depression screening',
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling/staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself',
      'Trouble concentrating',
      'Moving/speaking slowly or being restless',
      'Thoughts of being better off dead',
    ],
    max: 27,
    thresholds: [{ score: 4, label: 'Minimal', color: 'emerald' }, { score: 9, label: 'Mild', color: 'amber' }, { score: 14, label: 'Moderate', color: 'orange' }, { score: 19, label: 'Moderately Severe', color: 'rose' }, { score: 27, label: 'Severe', color: 'red' }],
  },
  'GAD-7': {
    desc: 'Anxiety screening',
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless it\'s hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid as if something awful might happen',
    ],
    max: 21,
    thresholds: [{ score: 4, label: 'Minimal', color: 'emerald' }, { score: 9, label: 'Mild', color: 'amber' }, { score: 14, label: 'Moderate', color: 'orange' }, { score: 21, label: 'Severe', color: 'rose' }],
  },
  'Burnout Scale': { desc: 'Workplace exhaustion', questions: ['Emotionally drained from work/study', 'Used up at the end of the day', 'Tired when facing another day', 'Working all day is a strain', 'Feel burned out'], max: 15, thresholds: [{ score: 5, label: 'Low', color: 'emerald' }, { score: 10, label: 'Moderate', color: 'amber' }, { score: 15, label: 'High', color: 'rose' }] },
  'Stress Scale': { desc: 'Perceived stress', questions: ['Felt unable to control important things', 'Felt confident handling problems', 'Things going your way', 'Difficulties piling up'], max: 12, thresholds: [{ score: 4, label: 'Low', color: 'emerald' }, { score: 8, label: 'Moderate', color: 'amber' }, { score: 12, label: 'High', color: 'rose' }] },
  'Sleep Quality': { desc: 'How you\'re resting', questions: ['Trouble falling asleep', 'Waking during the night', 'Feeling unrested', 'Daytime drowsiness'], max: 12, thresholds: [{ score: 4, label: 'Good', color: 'emerald' }, { score: 8, label: 'Fair', color: 'amber' }, { score: 12, label: 'Poor', color: 'rose' }] },
};

export const AssessmentsScreen: React.FC = () => {
  const { saveAssessment } = useEunoia();
  const [active, setActive] = useState<keyof typeof assessments | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const start = (key: keyof typeof assessments) => { setActive(key); setAnswers([]); setDone(false); };
  const answer = (val: number) => {
    const next = [...answers, val];
    setAnswers(next);
    if (active && next.length === assessments[active].questions.length) {
      setDone(true);
      const total = next.reduce((a, b) => a + b, 0);
      const sev = assessments[active].thresholds.find(t => total <= t.score);
      saveAssessment({ type: active, score: total, maxScore: assessments[active].max, severity: sev?.label || 'Unknown' });
    }
  };
  const total = answers.reduce((a, b) => a + b, 0);
  const severity = active ? assessments[active].thresholds.find(t => total <= t.score) : null;

  return (
    <ScreenShell title="Wellness Assessments" subtitle="Clinical tools to understand yourself" gradient="from-indigo-100 via-blue-50 to-violet-100">
      {!active && (
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.entries(assessments).map(([key, a]) => (
            <button key={key} onClick={() => start(key as any)} className="text-left rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-white/60">
              <h3 className="font-semibold text-slate-900 dark:text-white">{key}</h3>
              <p className="text-xs text-slate-500 mt-1">{a.desc}</p>
              <p className="text-xs text-violet-600 font-medium mt-3">{a.questions.length} questions · 2 min</p>
            </button>
          ))}
          <button onClick={() => start('PHQ-9')} className="text-left rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 text-white p-5 shadow-lg">
            <h3 className="font-semibold">Suicide Risk Screening</h3>
            <p className="text-xs text-rose-100 mt-1">Brief safety check</p>
            <p className="text-xs font-medium mt-3 text-white/90">Confidential · 1 min</p>
          </button>
        </div>
      )}

      {active && !done && (
        <div className="max-w-xl mx-auto">
          <div className="rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-sm border border-white/60">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">{active}</h3>
              <span className="text-xs text-slate-500">{answers.length + 1} / {assessments[active].questions.length}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all" style={{ width: `${(answers.length / assessments[active].questions.length) * 100}%` }} />
            </div>
            <p className="text-base text-slate-800 dark:text-white mt-6 leading-relaxed">Over the past 2 weeks:<br /><strong>{assessments[active].questions[answers.length]}</strong></p>
            <div className="space-y-2 mt-5">
              {['Not at all', 'Several days', 'More than half the days', 'Nearly every day'].map((label, i) => (
                <button key={i} onClick={() => answer(i)} className="w-full text-left p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors text-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-slate-100 text-center text-xs leading-6 mr-3 font-medium">{i}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {active && done && severity && (
        <div className="max-w-xl mx-auto">
          <div className="rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-sm border border-white/60">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-slate-500">Your score</p>
              <p className="text-5xl font-bold text-slate-900 dark:text-white mt-1">{total}<span className="text-xl text-slate-400">/{assessments[active].max}</span></p>
              <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold ${
                severity.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                severity.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                severity.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                severity.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                'bg-red-100 text-red-700'
              }`}>
                {severity.label}
              </span>

            </div>
            <div className="mt-6 p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20">
              <h4 className="text-sm font-semibold text-violet-900 dark:text-violet-200 mb-1">What this means</h4>
              <p className="text-xs text-violet-800 dark:text-violet-300 leading-relaxed">
                Your responses suggest <strong>{severity.label.toLowerCase()}</strong> symptoms. This is a screening, not a diagnosis. Consider tracking your mood daily and trying the wellness tools. If your distress feels overwhelming, please reach out to a therapist or trusted person.
              </p>
            </div>
            <button onClick={() => setActive(null)} className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold">Take another assessment</button>
          </div>
        </div>
      )}
    </ScreenShell>
  );
};

// --- Generic tool screen ---
export const ToolScreen: React.FC<{ title: string; gradient: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, gradient, icon: Icon, children }) => (
  <ScreenShell title={title} gradient={gradient}>
    <div className={`rounded-3xl bg-gradient-to-br ${gradient.replace('100', '400').replace('50', '500')} p-6 text-white shadow-xl mb-5`}>
      <Icon className="w-10 h-10" />
      <h2 className="text-2xl font-bold mt-2">{title}</h2>
    </div>
    {children}
  </ScreenShell>
);

// --- Gratitude ---
export const GratitudeScreen: React.FC = () => {
  const [items, setItems] = useState<string[]>(['', '', '']);
  const [saved, setSaved] = useState(false);
  return (
    <ScreenShell title="Gratitude Practice" gradient="from-amber-100 via-orange-50 to-yellow-100">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-white/60">
        <Heart className="w-10 h-10 text-amber-500" />
        <h3 className="font-semibold text-slate-900 mt-3">3 things I'm grateful for today</h3>
        <p className="text-sm text-slate-500 mt-1">Small things count. Big things count more when noticed.</p>
        {items.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => setItems(s => s.map((x, j) => j === i ? e.target.value : x))}
            placeholder={`${i + 1}. ${['A person…', 'A moment…', 'A small joy…'][i]}`}
            className="w-full mt-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 outline-none focus:border-amber-400 text-sm"
          />
        ))}
        <button onClick={() => setSaved(true)} className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold">Save</button>
        {saved && <p className="text-center text-sm text-emerald-600 mt-3">✨ Beautiful. Saved to your healing journey.</p>}
      </div>
    </ScreenShell>
  );
};

// --- Grounding 5-4-3-2-1 ---
export const GroundingScreen: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { n: 5, sense: 'things you can SEE', color: 'from-sky-400 to-blue-500' },
    { n: 4, sense: 'things you can TOUCH', color: 'from-teal-400 to-emerald-500' },
    { n: 3, sense: 'things you can HEAR', color: 'from-violet-400 to-purple-500' },
    { n: 2, sense: 'things you can SMELL', color: 'from-rose-400 to-pink-500' },
    { n: 1, sense: 'thing you can TASTE', color: 'from-amber-400 to-orange-500' },
  ];
  return (
    <ScreenShell title="Grounding · 5-4-3-2-1" gradient="from-teal-100 via-cyan-50 to-sky-100">
      <div className="text-center">
        {step < steps.length ? (
          <div className={`rounded-3xl bg-gradient-to-br ${steps[step].color} p-10 text-white shadow-2xl`}>
            <p className="text-7xl font-bold">{steps[step].n}</p>
            <p className="text-lg mt-2 font-semibold">{steps[step].sense}</p>
            <p className="text-sm text-white/85 mt-2">Take your time. Notice each one fully.</p>
            <button onClick={() => setStep(s => s + 1)} className="mt-6 px-8 py-3 rounded-2xl bg-white/25 backdrop-blur font-semibold hover:bg-white/40">Next</button>
          </div>
        ) : (
          <div className="rounded-3xl bg-emerald-50 p-10">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold mt-3">You're here.</h3>
            <p className="text-sm text-slate-600 mt-2">You brought yourself back to this moment. That's strength.</p>
            <button onClick={() => setStep(0)} className="mt-5 px-6 py-2.5 rounded-2xl bg-emerald-500 text-white font-medium">Again</button>
          </div>
        )}
      </div>
    </ScreenShell>
  );
};

// --- Crisis / Emergency ---
export const CrisisScreen: React.FC<{ kind: 'emergency' | 'suicide' | 'plan' }> = ({ kind }) => {
  const hotlines = [
    { name: 'Nepal — Crisis Helpline', phone: '1166', desc: '24/7 emotional support' },
    { name: 'India — iCall', phone: '9152987821', desc: 'Mon–Sat, 8am–10pm' },
    { name: 'International — 988', phone: '988', desc: 'Suicide & Crisis Lifeline' },
    { name: 'Vandrevala Foundation', phone: '1860-2662-345', desc: 'India, 24/7' },
  ];
  return (
    <ScreenShell title={kind === 'plan' ? 'Crisis Plan' : 'Emergency Support'} gradient="from-rose-100 via-pink-50 to-red-100">
      <div className="rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white shadow-xl">
        <AlertCircle className="w-10 h-10" />
        <h2 className="text-xl font-bold mt-2">You are not alone.</h2>
        <p className="text-sm text-rose-100 mt-2 leading-relaxed">Whatever you're feeling right now is real, and it's okay to ask for help. Please reach out.</p>
      </div>
      <div className="mt-5 space-y-2">
        {hotlines.map(h => (
          <a key={h.phone} href={`tel:${h.phone}`} className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm border border-white/60 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center"><Phone className="w-5 h-5" /></div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{h.name}</p>
              <p className="text-xs text-slate-500">{h.desc}</p>
            </div>
            <span className="font-bold text-rose-600">{h.phone}</span>
          </a>
        ))}
      </div>
      {kind === 'plan' && (
        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm border border-white/60">
          <h3 className="font-semibold text-slate-900 mb-3">My Safety Plan</h3>
          {['Warning signs I notice', 'Coping things I can do alone', 'People I can call', 'Reasons I want to live', 'How to make my space safer'].map((p, i) => (
            <div key={i} className="mt-3">
              <label className="text-xs font-medium text-slate-600">{i + 1}. {p}</label>
              <textarea rows={2} className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-rose-400 resize-none" />
            </div>
          ))}
          <button className="w-full mt-4 py-3 rounded-2xl bg-rose-500 text-white font-semibold">Save Plan</button>
        </div>
      )}
    </ScreenShell>
  );
};

// --- Trusted Contacts ---
export const TrustedContactsScreen: React.FC = () => {
  const { trustedContacts, addTrustedContact } = useEunoia();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  return (
    <ScreenShell title="Trusted Contacts" subtitle="Your safe circle">
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-white/60 mb-4">
        <h3 className="font-semibold text-slate-900 mb-2">Add someone you trust</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-4 py-2.5 mb-2 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none" />
        <button onClick={() => { if (name && phone) { addTrustedContact({ name, phone }); setName(''); setPhone(''); } }} className="w-full mt-3 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add</button>
      </div>
      <div className="space-y-2">
        {trustedContacts.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm border border-white/60">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 font-bold flex items-center justify-center">{c.name[0]}</div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{c.name}</p>
              <p className="text-xs text-slate-500">{c.phone}</p>
            </div>
            <a href={`tel:${c.phone}`} className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Phone className="w-4 h-4" /></a>
          </div>
        ))}
      </div>
    </ScreenShell>
  );
};

// --- Therapist Detail / Booking ---
export const TherapistDetail: React.FC<{ payload: any }> = ({ payload: t }) => {
  const { addAppointment, closeScreen } = useEunoia();
  const [sessionType, setSessionType] = useState<'video' | 'audio' | 'chat'>('video');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [booked, setBooked] = useState(false);
  if (!t) return null;

  const book = () => {
    if (!date || !time) return;
    addAppointment({ therapistName: t.name, date, time, type: sessionType, status: 'upcoming' });
    setBooked(true);
    setTimeout(() => closeScreen(), 2000);
  };

  const slots = ['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM', '5:30 PM', '7:00 PM'];

  return (
    <ScreenShell title={t.name} subtitle={t.title} gradient="from-blue-100 via-sky-50 to-violet-100">
      {booked ? (
        <div className="rounded-3xl bg-emerald-50 p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-bold mt-3">Booked!</h3>
          <p className="text-sm text-slate-600 mt-1">Your {sessionType} session with {t.name} is confirmed for {date} at {time}.</p>
        </div>
      ) : (
        <>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-white/60">
            <div className="flex gap-4">
              <img src={t.img} className="w-24 h-24 rounded-3xl object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900">{t.name}</h3>
                <p className="text-sm text-slate-500">{t.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{t.rating}</span>
                  <span className="text-xs text-slate-400">· {t.reviews} reviews</span>
                </div>
                <p className="font-semibold text-violet-600 mt-2">{t.currency} {t.fee} / session</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">{t.bio}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {t.specialties.map((s: string) => <span key={s} className="text-xs px-2 py-1 rounded-full bg-violet-50 text-violet-700">{s}</span>)}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm border border-white/60 mt-4">
            <h3 className="font-semibold text-slate-900 mb-3">Session type</h3>
            <div className="grid grid-cols-3 gap-2">
              {([['video', Video, 'Video'], ['audio', Phone, 'Audio'], ['chat', MessageSquare, 'Chat']] as const).map(([k, Icon, label]) => (
                <button key={k} onClick={() => setSessionType(k as any)} className={`p-3 rounded-2xl border-2 transition-all ${sessionType === k ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}>
                  <Icon className="w-5 h-5 mx-auto" />
                  <p className="text-xs font-medium mt-1">{label}</p>
                </button>
              ))}
            </div>
            <h3 className="font-semibold text-slate-900 mt-5 mb-2">Pick a date</h3>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none" />
            <h3 className="font-semibold text-slate-900 mt-4 mb-2">Available slots</h3>
            <div className="grid grid-cols-3 gap-2">
              {slots.map(s => (
                <button key={s} onClick={() => setTime(s)} className={`py-2.5 rounded-2xl text-xs font-medium ${time === s ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-700'}`}>{s}</button>
              ))}
            </div>
            <button onClick={book} disabled={!date || !time} className="w-full mt-5 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold disabled:opacity-50">
              Book · {t.currency} {t.fee}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">Payment will be securely processed before your session.</p>
          </div>
        </>
      )}
    </ScreenShell>
  );
};

// --- Provider Dashboard ---
export const ProviderDashboard: React.FC = () => {
  const stats = [
    { label: 'Today\'s Sessions', value: '4', color: 'from-violet-500 to-indigo-500' },
    { label: 'This Week', value: '18', color: 'from-emerald-500 to-teal-500' },
    { label: 'Earnings (NPR)', value: '24,500', color: 'from-amber-500 to-orange-500' },
    { label: 'Rating', value: '4.9★', color: 'from-rose-500 to-pink-500' },
  ];
  return (
    <ScreenShell title="Provider Dashboard" subtitle="Dr. Priya Sharma" gradient="from-blue-100 via-violet-50 to-indigo-100">
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`rounded-3xl bg-gradient-to-br ${s.color} p-4 text-white shadow-lg`}>
            <p className="text-xs text-white/85">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-white/60 mt-4">
        <h3 className="font-semibold text-slate-900 mb-3">Today's appointments</h3>
        {[{ n: 'Aarav S.', t: '10:00 AM', type: 'Video · Anxiety' }, { n: 'Priya M.', t: '11:30 AM', type: 'Audio · CBT' }, { n: 'Suman R.', t: '2:00 PM', type: 'Video · Burnout' }, { n: 'Anita K.', t: '4:00 PM', type: 'Chat · Follow-up' }].map((a, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 mt-2">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 font-bold flex items-center justify-center">{a.n[0]}</div>
            <div className="flex-1">
              <p className="font-medium text-sm text-slate-900">{a.n}</p>
              <p className="text-xs text-slate-500">{a.type}</p>
            </div>
            <span className="text-sm font-semibold text-violet-600">{a.t}</span>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-white/60 mt-4">
        <h3 className="font-semibold text-slate-900 mb-3">Patient emotional trends (anonymized)</h3>
        <div className="flex items-end gap-2 h-24">
          {[6, 5, 7, 4, 5, 3, 4].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-xl bg-gradient-to-t from-violet-500 to-pink-400" style={{ height: `${v * 12}%` }} />
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">Average stress score is trending downward across active patients this week.</p>
      </div>
    </ScreenShell>
  );
};

// --- Generic listing screens ---
export const SimpleListScreen: React.FC<{ title: string; subtitle?: string; items: { title: string; desc: string; color: string }[] }> = ({ title, subtitle, items }) => (
  <ScreenShell title={title} subtitle={subtitle}>
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map(it => (
        <div key={it.title} className={`rounded-3xl bg-gradient-to-br ${it.color} p-5 text-white shadow-lg`}>
          <h3 className="font-bold text-lg">{it.title}</h3>
          <p className="text-sm text-white/85 mt-1">{it.desc}</p>
          <button className="mt-3 px-4 py-2 rounded-full bg-white/25 backdrop-blur text-sm font-medium">Start</button>
        </div>
      ))}
    </div>
  </ScreenShell>
);
