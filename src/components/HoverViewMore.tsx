import React from 'react';
import { cn } from '@/lib/utils';

interface HoverViewMoreProps {
  isVisible: boolean;
  className?: string;
}

const HoverViewMore = ({ isVisible, className }: HoverViewMoreProps) => {
  return (
    <div
      className={cn(
        "absolute bottom-2 right-2 text-sm font-semibold text-gray-800 transition-opacity duration-200", // Increased font size to text-sm, added font-semibold, and changed color to text-gray-800
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      Xem thêm
    </div>
  );
};

export default HoverViewMore;