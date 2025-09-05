import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  onMenuClick: () => void;
}

const ProfileHeader = ({ onMenuClick }: ProfileHeaderProps) => {
  return (
    <header className="flex items-center justify-start py-2 px-4 md:hidden">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default ProfileHeader;