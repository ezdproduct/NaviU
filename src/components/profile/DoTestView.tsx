import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility for conditional classes

const availableTests = [
  {
    id: 'naviu-mbti', // ID mới cho bài test MBTI NaviU
    title: 'Bài Test Toàn Diện NaviU', // Đã thay đổi tiêu đề
    description: 'Khám phá nhóm tính cách MBTI của bạn dựa trên hệ thống NaviU.',
    link: '/profile/test/naviu-mbti/do-test', // Đường dẫn mới
    isFeatured: true, // Thêm cờ để dễ dàng áp dụng style đặc biệt
  },
  {
    id: 'dgtc', // Đổi ID
    title: 'Trắc nghiệm ĐGTC', // Đổi tên hiển thị
    description: 'Khám phá 16 nhóm tính cách để hiểu sâu hơn về bản thân và cách bạn tương tác với thế giới.',
    link: '/profile/test/dgtc/do-test', // Đổi đường dẫn
    isFeatured: false,
  },
  // Đã xóa mục "Bài Test Toàn Diện NaviU"
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
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Bài Test Của Bạn</h1>
      <p className="text-gray-600 mb-8">Chọn một bài test dưới đây để bắt đầu hành trình khám phá bản thân.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableTests.map((test) => (
          <Card 
            key={test.id} 
            className={cn(
              "flex flex-col",
              test.isFeatured ? "bg-blue-600 text-white" : "bg-white text-gray-800"
            )}
          >
            <CardHeader>
              <CardTitle className={cn(test.isFeatured ? "text-white" : "text-gray-800")}>
                {test.title}
              </CardTitle>
              <CardDescription className={cn(test.isFeatured ? "text-blue-100" : "text-gray-600")}>
                {test.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <Button 
                asChild 
                className={cn(
                  test.isFeatured ? "bg-blue-800 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
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