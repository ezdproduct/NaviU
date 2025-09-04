import React from 'react';
import { useParams } from 'react-router-dom';
import MBTITestPage from './mbti/MBTITestPage'; // Đổi import từ DGTCQuiz sang MBTITestPage
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const TestRunnerPage = () => {
  const { testId } = useParams<{ testId: string }>();

  switch (testId) {
    case 'dgtc': // Đổi tên đường dẫn
      return <MBTITestPage />; // Render MBTITestPage
    // Trong tương lai, bạn có thể thêm các bài test khác ở đây
    // case 'holland':
    //   return <HollandTestApp />;
    default:
      return (
        <div className="flex items-center justify-center h-full p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Bài test không tồn tại</CardTitle>
              <CardDescription>
                Bài test bạn đang tìm kiếm không có sẵn hoặc đã bị xóa.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
  }
};

export default TestRunnerPage;