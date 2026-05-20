import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export type ScreenId =
  | 'home' | 'chat' | 'mood' | 'journal' | 'therapy' | 'profile'
  | 'ai-companion' | 'check-in' | 'breathing' | 'meditation' | 'quick-relax'
  | 'mood-tracker' | 'trends' | 'assessments' | 'recovery'
  | 'cbt' | 'gratitude' | 'sleep' | 'grounding'
  | 'find-therapist' | 'telemedicine' | 'audio-session' | 'video-session' | 'marketplace'
  | 'emergency' | 'suicide-support' | 'trusted-contacts' | 'crisis-plan'
  | 'support-groups' | 'challenges' | 'healing-journey' | 'growth'
  | 'provider-dashboard' | 'assessment-detail' | 'tool-detail' | 'therapist-detail'
  | 'real-connection'
  | 'human-support'
  | 'together-we-heal'
  | 'community-growth';

export type Language = 'English' | 'Nepali' | 'Hindi' | 'Arabic' | 'Chinese';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  stress: number;
  triggers: string[];
  note: string;
  timestamp: number;
}

interface JournalEntry {
  id: string;
  text: string;
  mood?: string;
  sentiment?: string;
  emotions?: string[];
  insight?: string;
  timestamp: number;
}

interface Appointment {
  id: string;
  therapistName: string;
  date: string;
  time: string;
  type: 'audio' | 'video' | 'chat';
  status: 'upcoming' | 'completed';
}

interface AssessmentResult {
  id: string;
  type: string;
  score: number;
  maxScore: number;
  severity: string;
  timestamp: number;
}

interface EunoiaState {
  currentTab: 'home' | 'chat' | 'mood' | 'journal' | 'therapy' | 'profile';
  setCurrentTab: (t: EunoiaState['currentTab']) => void;
  modalStack: { id: ScreenId; payload?: any }[];
  openScreen: (id: ScreenId, payload?: any) => void;
  closeScreen: () => void;
  closeAll: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
  darkMode: boolean;
  setDarkMode: (b: boolean) => void;
  moods: MoodEntry[];
  addMood: (m: Omit<MoodEntry, 'id' | 'timestamp'>) => Promise<void>;
  journals: JournalEntry[];
  addJournal: (j: Omit<JournalEntry, 'id' | 'timestamp'>) => Promise<void>;
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, 'id'>) => Promise<void>;
  trustedContacts: { id?: string; name: string; phone: string }[];
  addTrustedContact: (c: { name: string; phone: string }) => Promise<void>;
  assessmentResults: AssessmentResult[];
  saveAssessment: (a: Omit<AssessmentResult, 'id' | 'timestamp'>) => Promise<void>;
  streak: number;
  userName: string;
  setUserName: (n: string) => void;
  isAuthenticated: boolean;
}

const EunoiaContext = createContext<EunoiaState | undefined>(undefined);

const SAMPLE_MOODS: MoodEntry[] = [
  { id: '1', mood: 'Calm', emoji: '😌', stress: 3, triggers: ['Work'], note: 'Felt peaceful after meditation', timestamp: Date.now() - 86400000 * 6 },
  { id: '2', mood: 'Anxious', emoji: '😰', stress: 7, triggers: ['Exam'], note: 'Worried about results', timestamp: Date.now() - 86400000 * 5 },
  { id: '3', mood: 'Happy', emoji: '😊', stress: 2, triggers: [], note: 'Good day with friends', timestamp: Date.now() - 86400000 * 4 },
  { id: '4', mood: 'Sad', emoji: '😔', stress: 6, triggers: ['Family'], note: 'Missing home', timestamp: Date.now() - 86400000 * 3 },
  { id: '5', mood: 'Calm', emoji: '😌', stress: 4, triggers: [], note: 'Better today', timestamp: Date.now() - 86400000 * 2 },
  { id: '6', mood: 'Happy', emoji: '😊', stress: 2, triggers: [], note: 'Productive day', timestamp: Date.now() - 86400000 },
];

const SAMPLE_JOURNALS: JournalEntry[] = [
  { id: '1', text: 'Today I practiced breathing exercises and felt more grounded. Small wins matter.', mood: 'Calm', sentiment: 'positive', emotions: ['hopeful', 'grounded'], insight: 'You are building healthy coping habits — this consistency matters.', timestamp: Date.now() - 86400000 * 2 },
  { id: '2', text: 'Feeling overwhelmed with deadlines. So much pressure from family expectations.', mood: 'Anxious', sentiment: 'negative', emotions: ['overwhelmed', 'pressured'], insight: 'Family expectations can feel heavy. Remember, your worth isn\'t measured by performance.', timestamp: Date.now() - 86400000 },
];

export const EunoiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<EunoiaState['currentTab']>('home');
  const [modalStack, setModalStack] = useState<{ id: ScreenId; payload?: any }[]>([]);
  const [language, setLanguage] = useState<Language>('English');
  const [darkMode, setDarkMode] = useState(false);
  const [moods, setMoods] = useState<MoodEntry[]>(SAMPLE_MOODS);
  const [journals, setJournals] = useState<JournalEntry[]>(SAMPLE_JOURNALS);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', therapistName: 'Dr. Priya Sharma', date: '2026-05-18', time: '4:00 PM', type: 'video', status: 'upcoming' }
  ]);
  const [trustedContacts, setTrustedContacts] = useState<{ id?: string; name: string; phone: string }[]>([
    { name: 'Mom', phone: '+977-98XXXXXX' }
  ]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [userName, setUserName] = useState('Friend');

  // Load user data when logged in
  useEffect(() => {
    if (!user) {
      // Show samples for unauthenticated users
      setMoods(SAMPLE_MOODS);
      setJournals(SAMPLE_JOURNALS);
      setUserName('Friend');
      return;
    }
    const meta = (user.user_metadata as any) || {};
    setUserName(meta.name || meta.full_name || user.email?.split('@')[0] || 'Friend');

    (async () => {
      const [moodsRes, journalsRes, apptRes, tcRes, assRes] = await Promise.all([
        supabase.from('eunoia_moods').select('*').order('created_at', { ascending: true }),
        supabase.from('eunoia_journals').select('*').order('created_at', { ascending: false }),
        supabase.from('eunoia_appointments').select('*').order('date', { ascending: true }),
        supabase.from('eunoia_trusted_contacts').select('*'),
        supabase.from('eunoia_assessments').select('*').order('created_at', { ascending: false }),
      ]);

      if (moodsRes.data) {
        setMoods(moodsRes.data.length > 0 ? moodsRes.data.map((m: any) => ({
          id: m.id, mood: m.mood, emoji: m.emoji, stress: m.stress,
          triggers: m.triggers || [], note: m.note || '',
          timestamp: new Date(m.created_at).getTime()
        })) : SAMPLE_MOODS);
      }
      if (journalsRes.data) {
        setJournals(journalsRes.data.length > 0 ? journalsRes.data.map((j: any) => ({
          id: j.id, text: j.text, mood: j.mood, sentiment: j.sentiment,
          emotions: j.emotions || [], insight: j.insight,
          timestamp: new Date(j.created_at).getTime()
        })) : SAMPLE_JOURNALS);
      }
      if (apptRes.data) {
        setAppointments(apptRes.data.map((a: any) => ({
          id: a.id, therapistName: a.therapist_name, date: a.date, time: a.time,
          type: a.type, status: a.status
        })));
      }
      if (tcRes.data) setTrustedContacts(tcRes.data);
      if (assRes.data) setAssessmentResults(assRes.data.map((a: any) => ({
        id: a.id, type: a.type, score: a.score, maxScore: a.max_score,
        severity: a.severity, timestamp: new Date(a.created_at).getTime()
      })));
    })();
  }, [user?.id]);

  const openScreen = useCallback((id: ScreenId, payload?: any) => {
    setModalStack(s => [...s, { id, payload }]);
  }, []);
  const closeScreen = useCallback(() => setModalStack(s => s.slice(0, -1)), []);
  const closeAll = useCallback(() => setModalStack([]), []);

  const addMood = async (m: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const tempId = Date.now().toString();
    const local: MoodEntry = { ...m, id: tempId, timestamp: Date.now() };
    setMoods(s => [...s, local]);
    if (user) {
      const { data } = await supabase.from('eunoia_moods').insert({
        user_id: user.id, mood: m.mood, emoji: m.emoji, stress: m.stress,
        triggers: m.triggers, note: m.note
      }).select().single();
      if (data) setMoods(s => s.map(x => x.id === tempId ? { ...local, id: data.id } : x));
    }
  };

  const addJournal = async (j: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const tempId = Date.now().toString();
    const local: JournalEntry = { ...j, id: tempId, timestamp: Date.now() };
    setJournals(s => [local, ...s]);
    if (user) {
      const { data } = await supabase.from('eunoia_journals').insert({
        user_id: user.id, text: j.text, mood: j.mood, sentiment: j.sentiment,
        emotions: j.emotions || [], insight: j.insight
      }).select().single();
      if (data) setJournals(s => s.map(x => x.id === tempId ? { ...local, id: data.id } : x));
    }
  };

  const addAppointment = async (a: Omit<Appointment, 'id'>) => {
    const tempId = Date.now().toString();
    setAppointments(s => [...s, { ...a, id: tempId }]);
    if (user) {
      const { data } = await supabase.from('eunoia_appointments').insert({
        user_id: user.id, therapist_name: a.therapistName, date: a.date,
        time: a.time, type: a.type, status: a.status
      }).select().single();
      if (data) setAppointments(s => s.map(x => x.id === tempId ? { ...a, id: data.id } : x));
    }
  };

  const addTrustedContact = async (c: { name: string; phone: string }) => {
    setTrustedContacts(s => [...s, c]);
    if (user) {
      const { data } = await supabase.from('eunoia_trusted_contacts').insert({
        user_id: user.id, name: c.name, phone: c.phone
      }).select().single();
      if (data) setTrustedContacts(s => s.map((x, i) => i === s.length - 1 ? { ...c, id: data.id } : x));
    }
  };

  const saveAssessment = async (a: Omit<AssessmentResult, 'id' | 'timestamp'>) => {
    const tempId = Date.now().toString();
    setAssessmentResults(s => [{ ...a, id: tempId, timestamp: Date.now() }, ...s]);
    if (user) {
      await supabase.from('eunoia_assessments').insert({
        user_id: user.id, type: a.type, score: a.score,
        max_score: a.maxScore, severity: a.severity
      });
    }
  };

  return (
    <EunoiaContext.Provider value={{
      currentTab, setCurrentTab, modalStack, openScreen, closeScreen, closeAll,
      language, setLanguage, darkMode, setDarkMode,
      moods, addMood, journals, addJournal, appointments, addAppointment,
      trustedContacts, addTrustedContact, assessmentResults, saveAssessment,
      streak: 7, userName, setUserName, isAuthenticated: !!user
    }}>
      {children}
    </EunoiaContext.Provider>
  );
};

export const useEunoia = () => {
  const ctx = useContext(EunoiaContext);
  if (!ctx) throw new Error('useEunoia must be inside EunoiaProvider');
  return ctx;
};
