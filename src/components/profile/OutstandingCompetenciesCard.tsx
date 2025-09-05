import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomProgress } from '@/components/CustomProgress';
import HoverViewMore from '@/components/HoverViewMore';
import { competencyData } from '@/data/competencyData';
import { getCognitiveTitle } from '@/utils/dataMapping';
import { cn } from '@/lib/utils'; // Import cn utility

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
        "group relative flex flex-col h-full rounded-2xl cursor-pointer",
        isFaded && "opacity-50 grayscale" // Removed pointer-events-none
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg font-bold text-blue-600">NĂNG LỰC NỔI TRỘI</CardTitle>
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
      <HoverViewMore isVisible={isHovered} /> {/* Chỉ hiển thị khi hover, không phụ thuộc vào isFaded */}
    </Card>
  );
};

export default OutstandingCompetenciesCard;