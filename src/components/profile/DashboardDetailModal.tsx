import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Import Link

interface DashboardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: React.ReactNode; // Can be string or JSX
  content?: React.ReactNode; // Optional additional content
  testLink?: string; // New prop for test link when no data
  noDataDescription?: string; // New prop for description when no data
}

const DashboardDetailModal = ({ isOpen, onClose, title, description, content, testLink, noDataDescription }: DashboardDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>
            {noDataDescription ? (
              <p className="text-gray-600">{noDataDescription}</p>
            ) : (
              description
            )}
          </DialogDescription>
        </DialogHeader>
        {content && <div className="py-4">{content}</div>}
        <DialogFooter>
          {testLink && noDataDescription ? (
            <Button asChild onClick={onClose}> {/* Close modal on click */}
              <Link to={testLink}>Làm bài test</Link>
            </Button>
          ) : (
            <Button onClick={onClose}>Đóng</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDetailModal;