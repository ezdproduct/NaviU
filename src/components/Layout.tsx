import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16 overflow-y-auto no-scrollbar"> {/* Đã thêm overflow-y-auto no-scrollbar */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;