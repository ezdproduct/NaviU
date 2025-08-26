import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomProgress } from '@/components/CustomProgress';
import HoverViewMore from '@/components/HoverViewMore';

interface OutstandingCompetenciesCardProps {
  onClick: () => void;
}

const OutstandingCompetenciesCard = ({ onClick }: OutstandingCompetenciesCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative flex flex-col h-full rounded-2xl cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg font-bold text-blue-600">NĂNG LỰC NỔI TRỘI</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <p className="text-gray-700 mb-2">Tư duy Ngôn ngữ</p>
          <CustomProgress value={85} className="h-2" indicatorClassName="bg-blue-500" />
        </div>
        <div>
          <p className="text-gray-700 mb-2">Tư duy Logic</p>
          <CustomProgress value={70} className="h-2" indicatorClassName="bg-blue-500" />
        </div>
      </CardContent>
      <HoverViewMore isVisible={isHovered} />
    </Card>
  );
};

export default OutstandingCompetenciesCard;