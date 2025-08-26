import React from 'react';
import { Expert } from '@/data/expertData';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ExpertCardProps {
  expert: Expert;
  onViewProfile: (expert: Expert) => void;
  onBook: (expert: Expert) => void;
}

const ExpertCard = ({ expert, onViewProfile, onBook }: ExpertCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={expert.avatar} alt={expert.name} />
          <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold">{expert.name}</h3>
        <p className="text-sm text-muted-foreground">{expert.title}</p>
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold">{expert.rating}</span>
          <span className="text-sm text-muted-foreground">({expert.experience})</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap justify-center gap-2">
          {expert.specialties.map((spec) => (
            <Badge key={spec} variant="secondary">{spec}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => onViewProfile(expert)}>Xem hồ sơ</Button>
        <Button onClick={() => onBook(expert)}>Đặt lịch</Button>
      </CardFooter>
    </Card>
  );
};

export default ExpertCard;