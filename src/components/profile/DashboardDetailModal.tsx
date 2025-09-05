import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DashboardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode; // Can be string or JSX
  content?: React.ReactNode; // Optional additional content
}

const DashboardDetailModal = ({ isOpen, onClose, title, description, content }: DashboardDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content && <div className="py-4">{content}</div>}
        <div className="flex justify-end">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDetailModal;