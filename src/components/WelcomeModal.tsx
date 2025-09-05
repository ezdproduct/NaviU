import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const WelcomeModal = ({ isOpen, onClose, username }: WelcomeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chào mừng trở lại!</DialogTitle>
          <DialogDescription>
            Rất vui được gặp lại bạn, <span className="font-semibold text-blue-600">{username}</span>.
            Hãy cùng khám phá những cập nhật mới nhất trong báo cáo của bạn nhé!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <p className="text-lg text-gray-700">Chúc bạn một ngày làm việc hiệu quả!</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Bắt đầu khám phá</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;