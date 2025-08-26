import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import HoverViewMore from '@/components/HoverViewMore';

interface ActionCompassCardProps {
  onClick: () => void;
}

const ActionCompassCard = ({ onClick }: ActionCompassCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative flex flex-col h-full rounded-2xl cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg font-bold text-blue-600">KIM CHỈ NAM HÀNH ĐỘNG</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Sự Hài Hòa & Ý Nghĩa</h3>
        <p className="text-gray-700 leading-relaxed">
          Bạn được dẫn dắt bởi khát khao về một cuộc sống cân bằng, có ý nghĩa và đóng góp cho xã hội.
        </p>
      </CardContent>
      <HoverViewMore isVisible={isHovered} />
    </Card>
  );
};

export default ActionCompassCard;