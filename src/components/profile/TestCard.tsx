import React from 'react';
import { TestInfo } from '@/data/testHubData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

interface TestCardProps {
  test: TestInfo & { link?: string }; // Thêm link vào interface
}

const TestCard = ({ test }: TestCardProps) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className={`p-0 ${test.headerBgClass} rounded-t-lg`}>
        <div className="p-6 pb-2">
          <CardTitle className="text-lg font-bold">{test.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-6 py-4">
        <p className="text-sm text-gray-600">{test.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 px-6 pt-0 pb-6">
        <div className="flex flex-wrap gap-2">
          {test.tags.map((tag, index) => (
            <Badge key={tag} className={test.tagColorPalette[index % test.tagColorPalette.length]}>
              {tag}
            </Badge>
          ))}
        </div>
        <Button asChild className="mt-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
          <Link to={test.link || '#'}>
            Khám phá <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestCard;