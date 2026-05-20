import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, Globe2, Heart, ShieldAlert } from 'lucide-react';
import { useEunoia, Language } from '@/contexts/EunoiaContext';


interface Msg {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const quickPrompts = [
  "I'm feeling anxious",
  "I can't sleep",
  "I miss home",
  "Exam stress is killing me",
  "I feel lonely",
  "Help me breathe",
];

const AIChatScreen: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const { language, setLanguage } = useEunoia();

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        "Hi, I'm Eunoia 🌿 I'm here to listen — without judgment, anytime you need. What's on your heart today?",
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [listening, setListening] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next: Msg[] = [
      ...messages,
      { role: 'user', content, timestamp: Date.now() },
    ];

    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(
  'https://uamjijwwwzvpufmeyeoy.supabase.co/functions/v1/eunoia-ai-chat',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      messages: next.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      language,
      mode: 'companion',
    }),
  }
);

const data = await response.json();
const error = !response.ok ? { message: JSON.stringify(data) } : null;
      console.log('FUNCTION DATA:', data);
      console.log('FUNCTION ERROR:', error);

      if (error) {
        setMessages((s) => [
          ...s,
          {
            role: 'assistant',
            content: `Function error: ${error.message}`,
            timestamp: Date.now(),
          },
        ]);
        return;
      }

      setMessages((s) => [
        ...s,
        {
          role: 'assistant',
          content: data?.reply || 'No reply received from function.',
          timestamp: Date.now(),
        },
      ]);

      if (data?.crisisDetected) setCrisis(true);
    } catch (error) {
      console.error('AI CHAT ERROR:', error);

      setMessages((s) => [
        ...s,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting, but I'm still here. Take a slow breath — what's the heaviest thing on your mind?",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SR: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      alert('Voice input not supported in this browser');
      return;
    }

    const rec = new SR();

    rec.lang =
      language === 'Nepali'
        ? 'ne-NP'
        : language === 'Hindi'
        ? 'hi-IN'
        : language === 'Arabic'
        ? 'ar-SA'
        : language === 'Chinese'
        ? 'zh-CN'
        : 'en-US';

    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);

    rec.onresult = (e: any) => {
      setInput(e.results[0][0].transcript);
    };

    rec.start();
  };

  const langs: Language[] = ['English', 'Nepali', 'Hindi', 'Arabic', 'Chinese'];

  return (
    <div
      className={`${
        embedded ? '' : 'min-h-screen'
      } flex flex-col bg-gradient-to-b from-violet-50 via-white to-sky-50 dark:from-slate-950 dark:to-indigo-950`}
    >
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/40 dark:border-slate-700/40 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center shadow-lg shadow-violet-300/40">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Eunoia
            </h2>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Always here for you
            </p>
          </div>

          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="appearance-none pl-8 pr-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {langs.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <Globe2 className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
      </div>

      {crisis && (
        <div className="mx-4 mt-3 max-w-3xl md:mx-auto rounded-2xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 p-3 flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
            <strong>You're not alone.</strong> Please reach out:{' '}
            <a href="tel:1166" className="underline font-semibold">
              Nepal 1166
            </a>{' '}
            · iCall India 9152987821 · Intl 988
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-br-md shadow-lg shadow-violet-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-md shadow-sm border border-white/60 dark:border-slate-700/50'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-3xl rounded-bl-md bg-white dark:bg-slate-800 px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-2 max-w-3xl mx-auto w-full">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="flex-shrink-0 px-3 py-2 rounded-full bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-violet-300 hover:text-violet-700 transition-colors flex items-center gap-1"
              >
                <Heart className="w-3 h-3" />
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-t border-white/40 dark:border-slate-700/40 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Share what's on your mind…"
              className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />

            <button
              onClick={startVoice}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                listening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-violet-100'
              }`}
              aria-label="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 disabled:opacity-40 hover:scale-105 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatScreen;