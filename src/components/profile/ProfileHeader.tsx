import React from 'react';
import { Menu, User } from 'lucide-react'; // Import User icon
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Import Link

interface ProfileHeaderProps {
  onMenuClick: () => void;
}

const ProfileHeader = ({ onMenuClick }: ProfileHeaderProps) => {
  return (
    <header className="flex items-center justify-between py-2 px-4 bg-white shadow-sm rounded-lg md:hidden"> {/* Đã thay đổi p-4 thành py-2 px-4 và loại bỏ mb-4 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/">
          <img src="/naviU.png" alt="NaviU Logo" className="h-8" />
        </Link>
      </div>
      <Link to="/profile">
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    </header>
  );
};

export default ProfileHeader;