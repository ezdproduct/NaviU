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
          <CardTitle className={cn("text-lg font-bold", isFaded ? "text-white" : "text-gray-800")}>KIM CHỈ NAM HÀNH ĐỘNG</CardTitle> {/* Adjusted title color */}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {valueData ? (
          <>
            <h3 className={cn("text-2xl font-bold mb-2", isFaded ? "text-white" : "text-gray-800")}>{valueData.name}</h3> {/* Adjusted text color */}
            <p className={cn("leading-relaxed", isFaded ? "text-blue-100" : "text-gray-700")}>{valueData.description}</p> {/* Adjusted text color */}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-blue-100 text-center space-y-3"> {/* Changed text-gray-500 to text-blue-100 */}
            <p>Chưa có dữ liệu giá trị nghề nghiệp.</p>
            <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} size="sm" className="bg-blue-900 text-white hover:bg-blue-700 rounded-lg">Làm Bài Test Toàn Diện NaviU</Button> {/* Adjusted button color */}
          </div>
        )}
      </CardContent>
      <HoverViewMore isVisible={isHovered} className={cn(isFaded ? "text-white" : "text-gray-800")} /> {/* Adjusted hover text color */}
    </Card>
  );
};

export default ActionCompassCard;