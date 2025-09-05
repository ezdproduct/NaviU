import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface UnavailableTestCardProps {
  title: string;
  description?: string;
  returnToTestHub?: boolean;
}

const UnavailableTestCard = ({ 
  title, 
  description = "Bài test này hiện chưa được triển khai. Vui lòng quay lại sau.",
  returnToTestHub = true
}: UnavailableTestCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        {returnToTestHub && (
          <div className="p-4">
            <Button onClick={() => navigate('/profile/testhub')}>
              Quay lại Test Hub
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UnavailableTestCard;