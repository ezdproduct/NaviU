import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HoverViewMore from '@/components/HoverViewMore';
import { cn } from '@/lib/utils'; // Import cn utility

interface ActionCompassCardProps {
  onClick: () => void;
  valueData?: { name: string; description: string }; // New prop: full value data
  isFaded?: boolean; // New prop: to control faded state
}

const ActionCompassCard = ({ onClick, valueData, isFaded = false }: ActionCompassCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "group relative flex flex-col h-full rounded-2xl cursor-pointer bg-green-600 text-white", // Changed to bg-green-600 and text-white
        // isFaded && "opacity-50 grayscale" // Removed opacity-50 grayscale
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">KIM CHỈ NAM HÀNH ĐỘNG</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {valueData ? (
          <>
            <h3 className="text-2xl font-bold text-white mb-2">{valueData.name}</h3>
            <p className="text-white opacity-90 leading-relaxed">{valueData.description}</p>
          </>
        ) : (
          <p className="text-white opacity-80 text-center">Chưa có dữ liệu giá trị nghề nghiệp.</p> 
        )}
      </CardContent>
      <HoverViewMore isVisible={isHovered} className="text-white" />
    </Card>
  );
};

export default ActionCompassCard;