import React from 'react';
import { TestInfo } from '@/data/testHubData';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react'; // Import LucideIcon type
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Import cn utility

interface TestCardProps {
  test: TestInfo & { link?: string };
}

const TestCard = ({ test }: TestCardProps) => {
  const IconComponent: LucideIcon = test.icon; // Lấy component icon từ prop, đảm bảo kiểu LucideIcon

  return (
    <Card className="relative h-full flex flex-col rounded-xl shadow-md border border-gray-200 bg-white p-6">
      {/* Icon container */}
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", test.iconBgColor)}>
        {/* Apply 3D-like styling to the icon */}
        <IconComponent className={cn("w-6 h-6", test.iconColor, "drop-shadow-md transition-all duration-200 group-hover:scale-110")} />
      </div>
      <CardTitle className="text-xl font-bold text-gray-800 mb-2">{test.title}</CardTitle>
      <CardContent className="flex-grow p-0">
        <p className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis pr-10">
          {test.description}
        </p>
      </CardContent>
      {/* Arrow button */}
      <Link to={test.link || '#'} className="absolute bottom-6 right-6">
        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50 rounded-full">
          <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
    </Card>
  );
};

export default TestCard;