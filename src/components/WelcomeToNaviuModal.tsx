import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface WelcomeToNaviuModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const WelcomeToNaviuModal = ({ isOpen, onClose, username }: WelcomeToNaviuModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl">
        <div className="bg-white text-blue-800 p-8 text-center"> {/* Changed background to white and text to dark blue */}
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl font-bold">Chào mừng bạn đến với NaviU!</DialogTitle>
            <DialogDescription className="text-lg text-blue-700"> {/* Adjusted description text color for contrast */}
              Bạn chưa có báo cáo nào. Hãy làm bài test MBTI NaviU để khám phá tiềm năng của mình.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-8">
            <Button asChild
              className="bg-yellow-400 text-blue-800 hover:bg-yellow-500 text-base px-6 py-3 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={onClose} // Close modal when button is clicked
            >
              <Link to="/profile/test/naviu-mbti/do-test">Làm bài test MBTI NaviU</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeToNaviuModal;