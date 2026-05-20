import React, { useState } from 'react';
import { useEunoia } from '@/contexts/EunoiaContext';
import { Search, Star, Video, Phone, MessageSquare, Calendar, CheckCircle2, Languages } from 'lucide-react';

const therapistImgs = [
  'https://d64gsuwffb70l.cloudfront.net/6a06f62ecbc5fc58306f4125_1778841370146_4c9a23bc.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a06f62ecbc5fc58306f4125_1778841412377_84566844.png',
  'https://d64gsuwffb70l.cloudfront.net/6a06f62ecbc5fc58306f4125_1778841372925_9ec86bcd.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6a06f62ecbc5fc58306f4125_1778841379632_2cbb153a.png',
  'https://d64gsuwffb70l.cloudfront.net/6a06f62ecbc5fc58306f4125_1778841419906_2c3dfa68.png',
  'https://d64gsuwffb70l.cloudfront.net/6a06f62ecbc5fc58306f4125_1778841379705_39bab813.png',
];

export const therapists = [
  { id: '1', name: 'Dr. Priya Sharma', title: 'Clinical Psychologist', specialties: ['Anxiety', 'CBT', 'Trauma'], fee: 1500, currency: 'NPR', rating: 4.9, reviews: 142, languages: ['English', 'Nepali', 'Hindi'], img: therapistImgs[0], bio: 'Specializes in cognitive behavioral therapy for South Asian students and professionals navigating academic and family pressure.' },
  { id: '2', name: 'Dr. Anil Karki', title: 'Psychiatrist', specialties: ['Depression', 'Burnout', 'Medication'], fee: 2500, currency: 'NPR', rating: 4.8, reviews: 98, languages: ['English', 'Nepali'], img: therapistImgs[1], bio: 'Board-certified psychiatrist with 12+ years treating mood disorders and stress-related conditions.' },
  { id: '3', name: 'Sneha Tamang', title: 'Counselor', specialties: ['Relationships', 'Grief', 'Self-esteem'], fee: 1200, currency: 'NPR', rating: 4.7, reviews: 76, languages: ['English', 'Nepali'], img: therapistImgs[2], bio: 'Warm, compassionate counselor specializing in emotional recovery and relationship dynamics.' },
  { id: '4', name: 'Rajesh Bhattarai', title: 'Wellness Coach', specialties: ['Sleep', 'Mindfulness', 'Habits'], fee: 900, currency: 'NPR', rating: 4.6, reviews: 54, languages: ['English', 'Nepali', 'Hindi'], img: therapistImgs[3], bio: 'Mindfulness-based coach for sleep, stress, and habit transformation.' },
  { id: '5', name: 'Dr. Meera Iyer', title: 'Clinical Psychologist', specialties: ['Migrant Mental Health', 'Loneliness', 'Anxiety'], fee: 1800, currency: 'NPR', rating: 5.0, reviews: 211, languages: ['English', 'Hindi', 'Tamil'], img: therapistImgs[4], bio: 'Renowned for her work with migrant populations and cross-cultural adjustment.' },
  { id: '6', name: 'Bikash Lama', title: 'Social Worker', specialties: ['Family Issues', 'Crisis', 'Community'], fee: 700, currency: 'NPR', rating: 4.5, reviews: 38, languages: ['Nepali', 'English'], img: therapistImgs[5], bio: 'Community-based social worker offering accessible support for families in crisis.' },
];

const TherapyScreen: React.FC<{ embedded?: boolean; filterType?: 'audio' | 'video' | 'chat' }> = ({ embedded, filterType }) => {
  const { openScreen } = useEunoia();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState<string | null>(null);
  const allSpecialties = Array.from(new Set(therapists.flatMap(t => t.specialties)));

  const filtered = therapists.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSpec = !specialty || t.specialties.includes(specialty);
    return matchesSearch && matchesSpec;
  });

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} bg-gradient-to-b from-sky-50 via-violet-50 to-rose-50 dark:from-slate-950 dark:to-indigo-950 pb-24`}>
      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-500 font-semibold">Therapy Marketplace</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Find your therapist</h1>
          <p className="text-sm text-slate-500 mt-1">Verified, licensed professionals — multilingual & culturally aware.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or specialty…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-violet-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setSpecialty(null)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${!specialty ? 'bg-violet-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>All</button>
          {allSpecialties.map(s => (
            <button key={s} onClick={() => setSpecialty(s)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${specialty === s ? 'bg-violet-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{s}</button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map(t => (
            <button
              key={t.id}
              onClick={() => openScreen('therapist-detail', t)}
              className="text-left rounded-3xl bg-white dark:bg-slate-800/60 p-4 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all border border-white/60 dark:border-slate-700/50"
            >
              <div className="flex gap-3">
                <img src={t.img} alt={t.name} className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">{t.name}</h3>
                  <p className="text-xs text-slate-500">{t.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{t.rating}</span>
                    <span className="text-xs text-slate-400">· {t.reviews} reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {t.specialties.slice(0, 3).map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">{s}</span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                <span className="text-xs flex items-center gap-1 text-slate-500"><Languages className="w-3 h-3" />{t.languages.length} languages</span>
                <span className="font-semibold text-sm text-slate-900 dark:text-white">{t.currency} {t.fee}<span className="text-xs font-normal text-slate-500">/session</span></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TherapyScreen;
