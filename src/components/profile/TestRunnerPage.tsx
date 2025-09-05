import React from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Import useLocation
import MBTITestPage from './mbti/MBTITestPage'; // Đổi import từ DGTCQuiz sang MBTITestPage
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DGTCResultData } from './mbti/DGTCResult'; // Import DGTCResultData
import UnavailableTestCard from './UnavailableTestCard'; // Import component mới

const TestRunnerPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const location = useLocation();
  const resultDataFromHistory = location.state?.resultData as DGTCResultData | undefined; // Lấy dữ liệu kết quả từ state cho ĐGTC

  switch (testId) {
    case 'dgtc': // Đổi tên đường dẫn
      return <MBTITestPage initialResultData={resultDataFromHistory} />; // Truyền dữ liệu kết quả ban đầu
    case 'naviu': // Xử lý trường hợp 'naviu' sau khi xóa bài test toàn diện
      return (
        <div className="flex items-center justify-center h-full p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Bài test Toàn Diện NaviU</CardTitle>
              <CardDescription>
                Bài test này đã bị xóa hoặc không còn khả dụng. Vui lòng chọn bài test khác.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    case 'naviu-mbti': // Giữ nguyên cho bài test MBTI NaviU
      return <UnavailableTestCard title="Trắc nghiệm MBTI (NaviU)" />;
    case 'holland':
      return <UnavailableTestCard title="Bài test Holland" />;
    case 'eq':
      return <UnavailableTestCard title="Bài test EQ" />;
    case 'values':
      return <UnavailableTestCard title="Bài test Giá trị Nghề nghiệp" />;
    default:
      return <UnavailableTestCard title="Bài test không tồn tại" description="Bài test bạn đang tìm kiếm không có sẵn hoặc đã bị xóa." />;
  }
};

export default TestRunnerPage;