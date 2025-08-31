import React from 'react';
import DashboardView from '@/components/profile/DashboardView';
import ReportView from '@/components/profile/ReportView';
import TestHubView from '@/components/profile/TestHubView';
import ConnectView from '@/components/profile/ConnectView';
import DoTestView from '@/components/profile/DoTestView';
import ProfileLayout from '@/components/profile/ProfileLayout'; // Import ProfileLayout
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();
  const initialActiveView = (location.state as { initialView?: string })?.initialView || 'dashboard';

  const renderActiveView = (view: string) => {
    switch (view) {
      case 'dashboard': return <DashboardView username={user?.username || 'Bạn'} />;
      case 'report': return <ReportView />;
      case 'testhub': return <TestHubView />;
      case 'connect': return <ConnectView />;
      case 'do-test': return <DoTestView />;
      default: return <DashboardView username={user?.username || 'Bạn'} />;
    }
  };

  return (
    <ProfileLayout>
      {renderActiveView(initialActiveView)}
    </ProfileLayout>
  );
};

export default Profile;