import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/profile/Sidebar';
import ProfileHeader from '@/components/profile/ProfileHeader'; // Header cho mobile (hamburger menu)
import ProfilePageHeader from '@/components/profile/ProfilePageHeader'; // Header mới cho desktop
import DashboardView from '@/components/profile/DashboardView';
import ReportView from '@/components/profile/ReportView';
import TestHubView from '@/components/profile/TestHubView';
import ConnectView from '@/components/profile/ConnectView';
import DoTestView from '@/components/profile/DoTestView';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/CustomSheet'; // Đã thay đổi import từ ui/sheet sang CustomSheet
import SidebarContent from '@/components/profile/SidebarContent';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation và useNavigate
import WelcomeModal from '@/components/WelcomeModal'; // Import WelcomeModal
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const Profile = () => {
  const isMobile = useIsMobile();
  const location = useLocation(); // Lấy đối tượng location từ React Router
  const navigate = useNavigate(); // Khởi tạo useNavigate để xóa state
  const { user } = useAuth(); // Lấy thông tin người dùng từ AuthContext

  // Đọc initialView từ state của location, nếu không có thì mặc định là 'dashboard'
  const initialActiveView = (location.state as { initialView?: string })?.initialView || 'dashboard';
  const [activeView, setActiveView] = useState(initialActiveView);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mặc định thu gọn
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false); // State để điều khiển modal
  const [usernameForModal, setUsernameForModal] = useState(''); // State để lưu tên người dùng cho modal

  // Cuộn lên đầu trang khi activeView thay đổi và xử lý WelcomeModal
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const state = location.state as { initialView?: string; showWelcome?: boolean; username?: string } | undefined;
    if (state?.showWelcome) {
      setShowWelcomeModal(true);
      setUsernameForModal(state.username || user?.username || ''); // Ưu tiên state, sau đó đến context
      // Xóa state 'showWelcome' và 'username' để modal không hiển thị lại khi refresh
      navigate(location.pathname, { replace: true, state: { initialView: state.initialView } });
    }
  }, [activeView, location.state, location.pathname, navigate, user?.username]); // Thêm navigate và user?.username vào dependencies

  // Xử lý đóng sidebar khi click ra ngoài (chỉ cho desktop)
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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, isMobile]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView username={user?.username || 'Bạn'} />; // Truyền username vào DashboardView
      case 'report': return <ReportView />;
      case 'testhub': return <TestHubView />;
      case 'connect': return <ConnectView />;
      case 'do-test': return <DoTestView />;
      default: return <DashboardView username={user?.username || 'Bạn'} />;
    }
  };

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar (Sheet) */}
      {isMobile ? (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64 bg-gray-800 border-r-0">
            <div className="flex flex-col h-full py-0">
              <SidebarContent 
                isSidebarOpen={true}
                activeView={activeView} 
                setActiveView={handleViewChange} 
                onToggle={() => setIsSidebarOpen(false)} 
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        // Desktop Sidebar
        <Sidebar 
          ref={sidebarRef}
          isSidebarOpen={isSidebarOpen}
          activeView={activeView} 
          setActiveView={handleViewChange} 
          onToggle={toggleSidebar} 
        />
      )}
      
      {/* Khu vực nội dung chính (bao gồm header và nội dung tab) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header cho mobile (chỉ hiển thị nút menu) */}
        {isMobile && <ProfileHeader onMenuClick={toggleSidebar} />}

        <div ref={mainContentRef} className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col px-4"> {/* Changed pr-4 to px-4 */}
          {!isMobile && <ProfilePageHeader />}
          <div key={activeView}> 
            {renderActiveView()}
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeModalClose}
        username={usernameForModal}
      />
    </div>
  );
};

export default Profile;