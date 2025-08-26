import React from 'react';
import { Expert } from '@/data/expertData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Briefcase } from 'lucide-react';

interface ExpertProfileModalProps {
  expert: Expert | null;
  onClose: () => void;
  onBook: (expert: Expert) => void;
}

const ExpertProfileModal = ({ expert, onClose, onBook }: ExpertProfileModalProps) => {
  if (!expert) return null;

  return (
    <Dialog open={!!expert} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{expert.name}</DialogTitle>
              <DialogDescription>{expert.title}</DialogDescription>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{expert.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{expert.experience}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Giới thiệu</h4>
            <p className="text-sm text-muted-foreground">{expert.bio}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Chuyên môn</h4>
            <div className="flex flex-wrap gap-2">
              {expert.specialties.map((spec) => (
                <Badge key={spec} variant="outline">{spec}</Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Đóng</Button>
          <Button onClick={() => onBook(expert)}>Đặt lịch tư vấn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertProfileModal;