import React from 'react';
import { Menu, User } from 'lucide-react'; // Import User icon
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Import Link

interface ProfileHeaderProps {
  onMenuClick: () => void;
}

const ProfileHeader = ({ onMenuClick }: ProfileHeaderProps) => {
  return (
    <header className="flex items-center justify-between py-2 px-4 md:hidden">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        {/* Đã loại bỏ logo NaviU */}
      </div>
      <Link to="/profile/info"> {/* Updated link to /profile/info */}
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    </header>
  );
};

export default ProfileHeader;