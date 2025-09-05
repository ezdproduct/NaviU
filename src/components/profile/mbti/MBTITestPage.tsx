import React from "react";
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DGTCResultData } from "@/types";

interface MBTITestPageProps {
  initialResultData?: DGTCResultData;
}

export default function MBTITestPage({ initialResultData }: MBTITestPageProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartTest = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/profile/test/dgtc/do-test');
    }
  };

  return (
    <div className="p-4 sm:p-6 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg p-6 text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">Trắc nghiệm ĐGTC</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Khám phá 16 nhóm tính cách để hiểu sâu hơn về bản thân và cách bạn tương tác với thế giới.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Bài test này sẽ giúp bạn nhận diện những đặc điểm tính cách nổi bật, từ đó đưa ra những gợi ý hữu ích cho định hướng sự nghiệp và phát triển bản thân.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={handleStartTest} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
              Bắt đầu làm bài
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile/history/dgtc')} className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium">
              Xem lịch sử
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}