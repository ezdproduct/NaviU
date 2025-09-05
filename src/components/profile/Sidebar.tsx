import React from 'react';
import SidebarContent from './SidebarContent';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onToggle: () => void;
  isSidebarOpen: boolean;
}

// Chuyển Sidebar thành forwardRef component
const Sidebar = React.forwardRef<HTMLElement, SidebarProps>((props, ref) => {
  return (
    <aside 
      ref={ref}
      className={cn(
        "bg-white/30 backdrop-blur-md flex-col flex-shrink-0 hidden md:flex transition-[width] duration-500 ease-in-out h-full", // Đã thay đổi transition-all thành transition-[width]
        props.isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      <SidebarContent {...props} />
    </aside>
  );
});

// Đặt tên hiển thị cho component để dễ debug
Sidebar.displayName = "Sidebar";

export default Sidebar;