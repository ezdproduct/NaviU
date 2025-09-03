import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[calc(100vh-10rem)]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
};

export default LoadingSpinner;