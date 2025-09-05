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
                <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-600 hover:text-white"> {/* Updated hover styles */}
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={logout} variant="ghost" className="text-blue-600 hover:bg-blue-600 hover:text-white">Đăng xuất</Button> {/* Updated hover styles */}
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">Đăng nhập</Button> {/* Updated hover styles */}
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">Đăng ký</Button> {/* Updated hover styles */}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default LandingPageHeader;