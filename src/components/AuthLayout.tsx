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
            <p className="text-lg opacity-90">
              Tăng tốc công việc của bạn với ứng dụng web của chúng tôi.
            </p>
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

          {showSocialLogins && (
            <>
              <div className="relative flex justify-center text-xs uppercase mt-8 mb-6">
                <span className="bg-white px-2 text-gray-500">Hoặc</span>
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <FcGoogle className="h-5 w-5" />
                  <span>{isLogin ? 'Đăng nhập với Google' : 'Đăng ký với Google'}</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <FaApple className="h-5 w-5" />
                  <span>{isLogin ? 'Đăng nhập với Apple' : 'Đăng ký với Apple'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;