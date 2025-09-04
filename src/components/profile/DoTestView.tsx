import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const availableTests = [
  {
    id: 'dgtc', // Đổi ID
    title: 'Trắc nghiệm ĐGTC', // Đổi tên hiển thị
    description: 'Khám phá 16 nhóm tính cách để hiểu sâu hơn về bản thân và cách bạn tương tác với thế giới.',
    link: '/profile/do-test/dgtc', // Đổi đường dẫn
  },
  {
    id: 'naviu',
    title: 'Trắc nghiệm Tổng hợp NaviU',
    description: 'Tổng hợp và gửi kết quả từ các bài test khác (MBTI, EQ, Holland, Cognitive) để có báo cáo toàn diện.',
    link: '/profile/do-test/naviu',
  },
  // Thêm các bài test khác ở đây trong tương lai
  // {
  //   id: 'holland',
  //   title: 'Trắc nghiệm Holland',
  //   description: 'Xác định 6 nhóm sở thích nghề nghiệp cốt lõi của bạn để tìm ra môi trường làm việc lý tưởng.',
  //   link: '/profile/do-test/holland',
  // },
];

const DoTestView = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Cổng Bài Test</h1>
      <p className="text-gray-600 mb-8">Chọn một bài test dưới đây để bắt đầu hành trình khám phá bản thân.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableTests.map((test) => (
          <Card key={test.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{test.title}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <Button asChild>
                <Link to={test.link}>
                  Bắt đầu làm bài <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoTestView;