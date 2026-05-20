import React from 'react';
import { useEunoia, ScreenId } from '@/contexts/EunoiaContext';
import UnderConstruction from '@/components/UnderConstruction';

import AIChatScreen from './AIChatScreen';
import MoodScreen from './MoodScreen';
import ScreenShell from './ScreenShell';

import {
  BreathingScreen,
  MeditationScreen,
  AssessmentsScreen,
  GratitudeScreen,
  GroundingScreen,
  CrisisScreen,
  TrustedContactsScreen,
  TherapistDetail,
  ProviderDashboard,
  SimpleListScreen,
} from './DetailScreens';

const ScreenRouter: React.FC = () => {
  const { modalStack, closeScreen } = useEunoia();

  if (modalStack.length === 0) return null;

  const top = modalStack[modalStack.length - 1];

  const renderScreen = (id: ScreenId, payload?: any) => {
    switch (id) {
      case 'ai-companion':
      case 'chat':
        return (
          <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 animate-in slide-in-from-right">
            <div className="absolute top-3 left-3 z-20">
              <button
                onClick={closeScreen}
                className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur text-xs font-medium shadow"
              >
                ← Back
              </button>
            </div>
            <AIChatScreen />
          </div>
        );

      case 'breathing':
        return <BreathingScreen />;

      case 'meditation':
        return <MeditationScreen />;

      case 'assessments':
        return <AssessmentsScreen />;

      case 'gratitude':
        return <GratitudeScreen />;

      case 'grounding':
        return <GroundingScreen />;

      case 'emergency':
      case 'suicide-support':
        return <CrisisScreen kind="suicide" />;

      case 'crisis-plan':
        return <CrisisScreen kind="plan" />;

      case 'trusted-contacts':
        return <TrustedContactsScreen />;

      case 'therapist-detail':
        return <TherapistDetail payload={payload} />;

      case 'provider-dashboard':
        return <ProviderDashboard />;

      case 'mood-tracker':
      case 'mood':
        return (
          <ScreenShell title="Mood Tracker">
            <MoodScreen embedded />
          </ScreenShell>
        );

      case 'trends':
        return <UnderConstruction title="Mood Trends" />;

      case 'recovery':
        return <UnderConstruction title="Recovery Tracking" />;

      case 'cbt':
        return (
          <SimpleListScreen
            title="CBT Worksheets"
            subtitle="Reframe thoughts"
            items={[
              {
                title: 'Thought Record',
                desc: 'Catch & challenge negative thinking patterns',
                color: 'from-violet-500 to-purple-600',
              },
              {
                title: 'Cognitive Distortions',
                desc: 'Identify common thinking traps',
                color: 'from-indigo-500 to-blue-600',
              },
              {
                title: 'Behavioral Activation',
                desc: 'Plan meaningful activities',
                color: 'from-rose-500 to-pink-600',
              },
              {
                title: 'ABC Model',
                desc: 'Activating event → Belief → Consequence',
                color: 'from-amber-500 to-orange-600',
              },
            ]}
          />
        );

      case 'sleep':
        return (
          <SimpleListScreen
            title="Sleep Tools"
            subtitle="Rest more deeply"
            items={[
              {
                title: 'Sleep Sounds',
                desc: 'Rain, ocean, forest, white noise',
                color: 'from-indigo-600 to-slate-700',
              },
              {
                title: 'Sleep Story',
                desc: '20-min guided drift',
                color: 'from-violet-600 to-indigo-700',
              },
              {
                title: 'Wind-down Routine',
                desc: '15-min evening reset',
                color: 'from-slate-600 to-indigo-600',
              },
              {
                title: 'Sleep Tracker',
                desc: 'Log & analyze patterns',
                color: 'from-purple-600 to-fuchsia-600',
              },
            ]}
          />
        );

      case 'check-in':
      case 'quick-relax':
        return (
          <ScreenShell title={id === 'check-in' ? 'Smart Check-In' : 'Quick Relaxation'}>
            <MoodScreen embedded />
          </ScreenShell>
        );

      case 'find-therapist':
      case 'telemedicine':
      case 'marketplace':
      case 'audio-session':
      case 'video-session':
      case 'human-support':
        return <UnderConstruction title="Human Support" />;

      case 'support-groups':
      case 'challenges':
      case 'healing-journey':
      case 'growth':
      case 'community-growth':
      case 'together-we-heal':
        return <UnderConstruction title="Community & Growth" />;

      case 'real-connection':
        return <UnderConstruction title="Real Connection" />;

      default:
        return null;
    }
  };

  return <>{renderScreen(top.id, top.payload)}</>;
};

export default ScreenRouter;