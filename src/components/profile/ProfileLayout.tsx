import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/profile/Sidebar';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/CustomSheet';
import SidebarContent from '@/components/profile/SidebarContent';
import WelcomeModal from '@/components/WelcomeModal'; // Existing "Chào mừng trở lại" modal
import WelcomeToNaviuModal from '@/components/WelcomeToNaviuModal'; // New "Chào mừng bạn đến với NaviU!" modal
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils'; // Import cn utility

const ProfileLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, naviuResult } = useAuth(); // Lấy naviuResult từ AuthContext

  // Lấy phân đoạn đường dẫn hiện tại để xác định activeView cho sidebar
  const currentPathSegment = location.pathname.split('/')[2] || 'dashboard'; 
  const isDoTestView = location.pathname.endsWith('/do-test'); // Kiểm tra xem có phải trang do-test không

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false); // For "Chào mừng trở lại"
  const [showNaviuWelcomeModal, setShowNaviuWelcomeModal] = useState(false); // For "Chào mừng bạn đến với NaviU!"
  const [usernameForModal, setUsernameForModal] = useState('');

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const state = location.state as { initialView?: string; showWelcome?: boolean; showNaviuWelcome?: boolean; username?: string } | undefined;
    
    // Handle "Chào mừng trở lại" modal
    if (state?.showWelcome) {
      setShowWelcomeModal(true);
      setUsernameForModal(state.username || user?.username || '');
      // Clear state to prevent re-showing on refresh
      navigate(location.pathname, { replace: true, state: { initialView: state.initialView } });
    }

    // Handle "Chào mừng bạn đến với NaviU!" modal
    // Only show if explicitly requested AND user has no naviuResult
    if (state?.showNaviuWelcome && !naviuResult) {
      setShowNaviuWelcomeModal(true);
      setUsernameForModal(state.username || user?.username || '');
      // Clear state to prevent re-showing on refresh
      navigate(location.pathname, { replace: true, state: { initialView: state.initialView } });
    }
  }, [location.state, location.pathname, navigate, user?.username, naviuResult]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile && isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    };

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewChange = (view: string) => {
    navigate(`/profile/${view}`); // Điều hướng trực tiếp bằng React Router
  };

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
  };

  const handleNaviuWelcomeModalClose = () => {
    setShowNaviuWelcomeModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {isMobile ? (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64 bg-white border-r-0">
            <div className="flex flex-col h-full py-0">
              <SidebarContent 
                isSidebarOpen={true}
                activeView={currentPathSegment} 
                setActiveView={handleViewChange} 
                onToggle={() => setIsSidebarOpen(false)} 
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Sidebar 
          ref={sidebarRef}
          isSidebarOpen={isSidebarOpen}
          activeView={currentPathSegment} 
          setActiveView={handleViewChange} 
          onToggle={toggleSidebar} 
        />
      )}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {isMobile && <ProfileHeader onMenuClick={toggleSidebar} />}

        <div 
          ref={mainContentRef} 
          className={cn(
            "flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col",
            !isDoTestView && "px-4 pt-10"
          )}
        >
          <Outlet /> {/* Render the nested route component here */}
        </div>
      </div>

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeModalClose}
        username={usernameForModal}
      />

      <WelcomeToNaviuModal
        isOpen={showNaviuWelcomeModal}
        onClose={handleNaviuWelcomeModalClose}
        username={usernameForModal}
      />
    </div>
  );
};

export default ProfileLayout;