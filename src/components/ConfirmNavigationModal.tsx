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

interface ConfirmNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmNavigationModal = ({ isOpen, onClose, onConfirm }: ConfirmNavigationModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận về Trang chủ</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn quay về trang chủ không? Mọi thay đổi chưa lưu có thể bị mất.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg">Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmNavigationModal;