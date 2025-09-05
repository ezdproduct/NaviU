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
        "group relative flex flex-col h-full rounded-2xl cursor-pointer shadow-sm border",
        isFaded ? "bg-blue-800 border-blue-700 text-white" : "bg-white text-gray-800", // Changed default bg-white to bg-blue-800 when faded
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {Icon && <Icon className={cn("h-6 w-6", isFaded ? "text-white" : "text-blue-600")} />} {/* Adjusted icon color */}
          <CardTitle className={cn("text-lg font-bold", isFaded ? "text-white" : "text-gray-800")}>NĂNG LỰC NỔI TRỘI</CardTitle> {/* Adjusted title color */}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {topCompetencies.length > 0 ? (
          topCompetencies.map(([key, value]) => (
            <div key={key}>
              <p className={cn("mb-2", isFaded ? "text-blue-100" : "text-gray-700")}>{getCognitiveTitle(key, competencyData)}</p> {/* Adjusted text color */}
              <CustomProgress value={value} className="h-2" indicatorClassName="bg-blue-500" />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-blue-100 text-center space-y-3"> {/* Changed text-gray-500 to text-blue-100 */}
            <p>Chưa có dữ liệu năng lực nhận thức.</p>
            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} size="sm" className="bg-blue-900 text-white hover:bg-blue-700 rounded-lg">Làm Bài Test Toàn Diện NaviU</Button> {/* Adjusted button color */}
          </div>
        )}
      </CardContent>
      <HoverViewMore isVisible={isHovered} className={cn(isFaded ? "text-white" : "text-gray-800")} /> {/* Adjusted hover text color */}
    </Card>
  );
};

export default OutstandingCompetenciesCard;