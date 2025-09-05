import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomProgress } from '@/components/CustomProgress';
import HoverViewMore from '@/components/HoverViewMore';
import { competencyData } from '@/data/competencyData';
import { getCognitiveTitle } from '@/utils/dataMapping';
import { cn } from '@/lib/utils'; // Import cn utility
import { Button } from '@/components/ui/button'; // Import Button
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface OutstandingCompetenciesCardProps {
  onClick: () => void;
  competencies?: { [key: string]: number };
  isFaded?: boolean;
  icon?: React.ElementType; // Add icon prop
}

const OutstandingCompetenciesCard = ({ onClick, competencies, isFaded = false, icon: Icon }: OutstandingCompetenciesCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

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
          {Icon && <Icon className="h-6 w-6 text-blue-600 drop-shadow-md transition-all duration-200 group-hover:scale-110" />}
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
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center space-y-3">
            <p>Chưa có dữ liệu năng lực nhận thức.</p>
            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} size="sm" className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Làm bài test MBTI NaviU</Button>
          </div>
        )}
      </CardContent>
      <HoverViewMore isVisible={isHovered} className="text-gray-800" />
    </Card>
  );
};

export default OutstandingCompetenciesCard;