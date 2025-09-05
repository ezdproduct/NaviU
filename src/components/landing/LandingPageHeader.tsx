import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';

const LandingPageHeader = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 bg-white shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/">
          <img src="/naviU.png" alt="NaviU Logo" className="h-8" />
        </Link>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="bg-blue-600 text-white hover:bg-blue-700 rounded-full"> {/* Updated to solid blue button */}
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={logout} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">Đăng xuất</Button> {/* Updated to solid blue button */}
            </>
          ) : (
            <>
              <Link to="/login">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">Đăng nhập</Button> {/* Updated to solid blue button */}
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">Đăng ký</Button> {/* Updated to solid blue button */}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default LandingPageHeader;