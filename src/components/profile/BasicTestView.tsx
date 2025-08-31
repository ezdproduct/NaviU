import React from 'react';
import { Button } from '@/components/ui/button';

interface BasicTestViewProps {
  onFinishTest: () => void;
}

const BasicTestView = ({ onFinishTest }: BasicTestViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm min-h-[calc(100vh-6rem)] p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Trắc nghiệm Cơ bản</h3>
      <p className="text-gray-600 text-center mb-8">
        Đây là giao diện cho các bài trắc nghiệm cơ bản. Nội dung bài test sẽ được hiển thị ở đây.
      </p>
      <Button onClick={onFinishTest} className="bg-blue-600 hover:bg-blue-700">
        Hoàn thành Trắc nghiệm Cơ bản
      </Button>
    </div>
  );
};

export default BasicTestView;