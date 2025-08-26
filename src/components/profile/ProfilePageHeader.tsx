import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react'; // Import icon User

const ProfilePageHeader = () => {
  return (
    <header className="flex justify-end items-center rounded-lg mb-4 px-4">
      <Link to="/profile-info"> {/* Changed link to /profile-info */}
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    </header>
  );
};

export default ProfilePageHeader;