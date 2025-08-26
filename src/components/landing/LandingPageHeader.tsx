import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';

const LandingPageHeader = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 bg-white shadow-sm"> {/* Changed background to white and added shadow */}
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/">
          <img src="/naviU.png" alt="NaviU Logo" className="h-8" />
        </Link>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50"> {/* Changed text color and hover effect */}
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={logout} variant="ghost" className="text-blue-600 hover:bg-blue-50">Đăng xuất</Button> {/* Changed text color and hover effect */}
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Đăng nhập</Button> {/* Changed to outline, blue border/text */}
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Đăng ký</Button> {/* Changed to outline, blue border/text */}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default LandingPageHeader;