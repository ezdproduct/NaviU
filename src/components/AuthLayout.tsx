"use client"

import React from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon from react-icons
import { FaApple } from 'react-icons/fa'; // Import Apple icon from react-icons

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  showSocialLogins?: boolean;
  isLogin?: boolean;
}

const AuthLayout = ({ children, title, description, showSocialLogins = true, isLogin = false }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8">
      <div className="relative flex w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden bg-white">
        {/* Left Section - Gradient Background */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 p-12 flex-col justify-between text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">Chào mừng bạn!</h1>
          </div>
          <div className="flex flex-wrap gap-4 text-sm opacity-70">
            {/* Placeholder for social icons or other branding */}
            <span>© NaviU 2025</span>
            <span>|</span>
            <span>Điều khoản dịch vụ</span>
            <span>|</span>
            <span>Chính sách bảo mật</span>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-8">{description}</p>

          {children}

          {/* Removed social login buttons */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;