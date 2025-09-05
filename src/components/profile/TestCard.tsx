import React from 'react';
import { TestInfo } from '@/data/testHubData';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react'; // Import FileText icon
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { cn } from '@/lib/utils'; // Import cn utility
import { IconType } from 'react-icons'; // Import IconType

interface TestCardProps {
  test: TestInfo & { link?: string; resultLink?: string; testType: string }; // Add resultLink and testType
}

const TestCard = ({ test }: TestCardProps) => {
  const IconComponent: IconType = test.icon;
  const navigate = useNavigate();

  const handleViewReport = () => {
    // Navigate to the result page, passing the testType
    navigate(test.resultLink || '#', { state: { testType: test.testType } });
  };

  return (
    <Card className="relative h-full flex flex-col rounded-xl shadow-md border border-gray-200 bg-white p-6">
      {/* Icon container */}
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", test.iconBgColor)}>
        <IconComponent className={cn("w-6 h-6", test.iconColor)} />
      </div>
      <CardTitle className="text-xl font-bold text-gray-800 mb-2">{test.title}</CardTitle>
      <CardContent className="flex-grow p-0">
        <p className="text-sm text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis pr-10">
          {test.description}
        </p>
      </CardContent>
      <div className="flex justify-between items-center mt-4"> {/* New container for buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewReport}
          className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"
        >
          <FileText className="h-4 w-4" />
          Xem báo cáo
        </Button>
        <Link to={test.link || '#'}>
          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50 rounded-full">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default TestCard;