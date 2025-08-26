import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed
import { User } from 'lucide-react';

const LandingPageHeader = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 bg-white/30 backdrop-blur-md"> {/* Changed py-2 to py-3 */}
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/">
          <img src="/naviU.png" alt="NaviU Logo" className="h-8" />
        </Link>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={logout} variant="ghost" className="text-white hover:bg-white/20">Đăng xuất</Button> {/* Changed to variant="ghost" and text-white */}
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-white text-white hover:bg-white/20">Đăng ký</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default LandingPageHeader;