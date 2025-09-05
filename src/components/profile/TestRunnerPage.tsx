import React from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Import useLocation
import MBTITestPage from './mbti/MBTITestPage'; // Đổi import từ DGTCQuiz sang MBTITestPage
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DGTCResultData } from './mbti/DGTCResult'; // Import DGTCResultData
import NaviUTestPage from './NaviUTestPage'; // Import NaviUTestPage mới

const TestRunnerPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const location = useLocation();
  const resultDataFromHistory = location.state?.resultData as DGTCResultData | undefined; // Lấy dữ liệu kết quả từ state cho ĐGTC
  const naviuResultDataFromHistory = location.state?.initialResultData; // Lấy dữ liệu kết quả từ state cho NaviU

  switch (testId) {
    case 'dgtc': // Đổi tên đường dẫn
      return <MBTITestPage initialResultData={resultDataFromHistory} />; // Truyền dữ liệu kết quả ban đầu
    case 'naviu': // Thêm trường hợp cho bài test NaviU
      return <NaviUTestPage initialResultData={naviuResultDataFromHistory} />; // Truyền dữ liệu kết quả ban đầu cho NaviU
    case 'holland':
      return (
        <div className="flex items-center justify-center h-full p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Bài test Holland</CardTitle>
              <CardDescription>
                Bài test này hiện chưa được triển khai. Vui lòng quay lại sau.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    case 'eq':
      return (
        <div className="flex items-center justify-center h-full p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Bài test EQ</CardTitle>
              <CardDescription>
                Bài test này hiện chưa được triển khai. Vui lòng quay lại sau.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    case 'values':
      return (
        <div className="flex items-center justify-center h-full p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Bài test Giá trị Nghề nghiệp</CardTitle>
              <CardDescription>
                Bài test này hiện chưa được triển khai. Vui lòng quay lại sau.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
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