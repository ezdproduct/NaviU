import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react'; // Import icon User

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-2 max-w-7xl mx-auto">
        <Link to="/">
          <img src="/naviU.png" alt="NaviU Logo" className="h-8" />
        </Link>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile-info"> {/* Changed link to /profile-info */}
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={logout}>Đăng xuất</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button>Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Đăng ký</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;