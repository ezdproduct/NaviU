import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

interface ConfirmSampleReportDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  testTitle: string;
}

const ConfirmSampleReportDownloadModal = ({ isOpen, onClose, onConfirm, testTitle }: ConfirmSampleReportDownloadModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tải báo cáo mẫu?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn chưa hoàn thành bài test "{testTitle}". Bạn có muốn tải báo cáo mẫu để tham khảo không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg">Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Tải báo cáo mẫu</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmSampleReportDownloadModal;