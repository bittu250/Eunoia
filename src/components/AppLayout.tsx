import React from 'react';
import { EunoiaProvider, useEunoia } from '@/contexts/EunoiaContext';
import { AuthProvider } from '@/contexts/AuthContext';
import HomeScreen from './eunoia/HomeScreen';
import AIChatScreen from './eunoia/AIChatScreen';
import MoodScreen from './eunoia/MoodScreen';
import JournalScreen from './eunoia/JournalScreen';
import TherapyScreen from './eunoia/TherapyScreen';
import ProfileScreen from './eunoia/ProfileScreen';
import BottomTabs from './eunoia/BottomTabs';
import ScreenRouter from './eunoia/ScreenRouter';
import AuthModal from './eunoia/AuthModal';

const TabContent: React.FC = () => {
  const { currentTab } = useEunoia();
  switch (currentTab) {
    case 'home': return <HomeScreen />;
    case 'chat': return <AIChatScreen />;
    case 'mood': return <MoodScreen />;
    case 'journal': return <JournalScreen />;
    case 'therapy': return <TherapyScreen />;
    case 'profile': return <ProfileScreen />;
    default: return <HomeScreen />;
  }
};

const AppLayout: React.FC = () => {
  return (
    <AuthProvider>
      <EunoiaProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <TabContent />
          <BottomTabs />
          <ScreenRouter />
          <AuthModal />
        </div>
      </EunoiaProvider>
    </AuthProvider>
  );
};

export default AppLayout;
