import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import ConfirmNavigationModal from '@/components/ConfirmNavigationModal';
import { useAuth } from '@/contexts/AuthContext';

// Import Heroicons
import {
  Squares2X2Icon, // For Dashboard
  DocumentTextIcon, // For Report
  ClipboardDocumentListIcon, // For Test Hub
  UsersIcon, // For Connect
  PencilSquareIcon, // For Do Test
  ChevronDoubleLeftIcon, // For Collapse
  ChevronDoubleRightIcon, // For Expand
  ArrowRightOnRectangleIcon, // For Logout
} from '@heroicons/react/24/outline'; // Sử dụng outline icons cho vẻ ngoài nhẹ nhàng

interface SidebarContentProps {
  activeView: string; // This will now be the path segment (e.g., 'dashboard', 'report')
  setActiveView: (view: string) => void; // This will now trigger navigation
  onToggle: () => void;
  isSidebarOpen: boolean;
}

const navItems = [
  { id: 'dashboard', name: 'Hồ Sơ Của Bạn', icon: Squares2X2Icon },
  { id: 'report', name: 'Báo cáo Chi tiết', icon: DocumentTextIcon },
  { id: 'testhub', name: 'TEST HUB', icon: ClipboardDocumentListIcon },
  { id: 'connect', name: 'Kết nối chuyên gia', icon: UsersIcon },
  { id: 'do-test', name: 'Làm Bài Test', icon: PencilSquareIcon },
];

const SidebarContent = ({ activeView, setActiveView, onToggle, isSidebarOpen }: SidebarContentProps) => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, viewId: string) => {
    e.preventDefault();
    if (!isSidebarOpen) {
      onToggle(); // Chỉ mở sidebar, không chuyển tab
    } else {
      setActiveView(viewId); // Gọi setActiveView để điều hướng
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isSidebarOpen) {
      e.preventDefault(); // Ngăn chặn chuyển hướng
      onToggle(); // Chỉ mở sidebar
    } else {
      e.preventDefault(); // Ngăn chặn chuyển hướng mặc định của Link
      setShowConfirmModal(true); // Hiển thị modal xác nhận
    }
  };

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    navigate('/');
  };

  return (
    <>
      <div className={cn("flex items-center justify-center py-4", !isSidebarOpen && "py-2")}>
        <Link
          to="/"
          className={cn("flex items-center", !isSidebarOpen && "justify-center")}
          onClick={handleLogoClick}
        >
          <img
            src={isSidebarOpen ? "/naviU.png" : "/logo.png"}
            alt="NaviU Logo"
            className="h-8"
          />
        </Link>
      </div>
      <nav className="flex-grow px-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => handleNavClick(e, item.id)}
            className={cn(
              'flex items-center space-x-3 px-4 py-3 my-1 rounded-lg transition-colors duration-200',
              activeView !== item.id && 'text-gray-700 hover:bg-gray-100',
              activeView === item.id && isSidebarOpen && 'bg-blue-600 text-white hover:bg-blue-700',
              activeView === item.id && !isSidebarOpen && 'text-blue-600 hover:bg-gray-100',
              !isSidebarOpen && "justify-center"
            )}
            title={isSidebarOpen ? '' : item.name}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className={cn("whitespace-nowrap", !isSidebarOpen && "hidden")}>{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="px-2 flex-shrink-0">
        <div className={cn("bg-blue-50 rounded-lg p-6 text-center mx-2", !isSidebarOpen && "hidden")}>
          <h4 className="font-semibold text-blue-800">Tư vấn 1-1</h4>
          <p className="text-sm mt-2 text-blue-700">Nâng cấp để nhận tư vấn chuyên sâu từ chuyên gia.</p>
          <button className="mt-4 bg-blue-600 text-white font-semibold w-full py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Nâng cấp
          </button>
        </div>

        {isAuthenticated && isSidebarOpen && (
          <button
            onClick={logout}
            className="flex items-center w-full space-x-3 px-4 py-3 mt-2 rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Đăng xuất</span>
          </button>
        )}

        <button
          onClick={onToggle}
          className="flex items-center w-full space-x-3 px-4 py-3 mt-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100"
        >
          {isSidebarOpen ? <ChevronDoubleLeftIcon className="h-5 w-5" /> : <ChevronDoubleRightIcon className="h-5 w-5 mx-auto" />}
          <span className={cn(!isSidebarOpen && "hidden")}>Thu gọn</span>
        </button>
      </div>

      <ConfirmNavigationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmNavigation}
      />
    </>
  );
};

export default SidebarContent;