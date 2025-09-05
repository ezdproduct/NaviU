import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HoverViewMore from '@/components/HoverViewMore';
import { cn } from '@/lib/utils'; // Import cn utility
import { Button } from '@/components/ui/button'; // Import Button
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface ActionCompassCardProps {
  onClick: () => void;
  valueData?: { name: string; description: string }; // New prop: full value data
  isFaded?: boolean;
  icon?: React.ElementType; // Add icon prop
}

const ActionCompassCard = ({ onClick, valueData, isFaded = false, icon: Icon }: ActionCompassCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Card
      className={cn(
        "group relative flex flex-col h-full rounded-2xl cursor-pointer bg-white text-gray-800 shadow-sm border border-gray-200",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {Icon && <Icon className="h-6 w-6 text-blue-600" />}
          <CardTitle className="text-lg font-bold text-gray-800">KIM CHỈ NAM HÀNH ĐỘNG</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {valueData ? (
          <>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{valueData.name}</h3>
            <p className="text-gray-700 leading-relaxed">{valueData.description}</p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center space-y-3">
            <p>Chưa có dữ liệu giá trị nghề nghiệp.</p>
            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} size="sm" className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Làm bài test MBTI NaviU</Button>
          </div>
        )}
      </CardContent>
      <HoverViewMore isVisible={isHovered} className="text-gray-800" />
    </Card>
  );
};

export default ActionCompassCard;