import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const DashboardCard = ({ title, description, onClick }: DashboardCardProps) => (
    <Card className="flex flex-col h-full rounded-2xl">
        <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
            <p className="text-gray-600 mt-2 mb-4 h-12 flex-grow">{description}</p>
            <Button onClick={onClick} className="w-full mt-auto">Xem chi tiết</Button>
        </CardContent>
    </Card>
);

export default DashboardCard;