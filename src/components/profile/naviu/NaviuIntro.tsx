import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NaviuIntroProps {
  onStartTest: () => void;
  onViewHistory: () => void;
}

const NaviuIntro: React.FC<NaviuIntroProps> = ({ onStartTest, onViewHistory }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg p-6 text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-800">Bài Test Toàn Diện NaviU</CardTitle>
        <CardDescription className="text-lg text-gray-600 mt-2">
          Khám phá toàn diện về bản thân với bài test tổng hợp từ NaviU.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">
          Bài test này kết hợp nhiều khía cạnh (MBTI, EQ, Năng lực nhận thức, Holland) để cung cấp cái nhìn sâu sắc nhất về bạn.
        </p>
        <Button onClick={onStartTest} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
          Bắt đầu làm bài
        </Button>
        <Button variant="outline" onClick={onViewHistory} className="ml-4 px-8 py-3 rounded-lg font-medium">
          Xem lịch sử làm bài
        </Button>
      </CardContent>
    </Card>
  );
};

export default NaviuIntro;