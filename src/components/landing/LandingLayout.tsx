import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingPageHeader from './LandingPageHeader';
import Footer from '@/components/Footer'; // Import Footer

const LandingLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingPageHeader />
      <main className="flex-1">
        <Outlet /> {/* Render the content of the landing page here */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;