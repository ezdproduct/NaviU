import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomProgress } from '@/components/CustomProgress';
import HoverViewMore from '@/components/HoverViewMore';
import { competencyData } from '@/data/competencyData';
import { getCognitiveTitle } from '@/utils/dataMapping';
import { cn } from '@/lib/utils'; // Import cn utility
import { Sparkles } from 'lucide-react'; // Import Sparkles icon

interface OutstandingCompetenciesCardProps {
  onClick: () => void;
  competencies?: { [key: string]: number };
  isFaded?: boolean; // Thêm prop isFaded
}

const OutstandingCompetenciesCard = ({ onClick, competencies, isFaded = false }: OutstandingCompetenciesCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const topCompetencies = Object.entries(competencies || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 2); // Lấy 2 năng lực cao nhất

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
          <Sparkles className="h-6 w-6 text-teal-600" />
          <CardTitle className="text-lg font-bold text-gray-800">NĂNG LỰC NỔI TRỘI</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {topCompetencies.length > 0 ? (
          topCompetencies.map(([key, value]) => (
            <div key={key}>
              <p className="text-gray-700 mb-2">{getCognitiveTitle(key, competencyData)}</p>
              <CustomProgress value={value} className="h-2" indicatorClassName="bg-blue-500" />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Chưa có dữ liệu năng lực nhận thức.</p> 
        )}
      </CardContent>
      <HoverViewMore isVisible={isHovered} className="text-gray-800" />
    </Card>
  );
};

export default OutstandingCompetenciesCard;