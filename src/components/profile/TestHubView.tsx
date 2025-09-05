import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { testHubData } from '@/data/testHubData';
import TestCard from './TestCard';

const getTestLink = (testTitle: string): string => {
  if (testTitle.toLowerCase().includes('đgtc')) {
    return '/profile/test/dgtc/do-test';
  }
  if (testTitle.toLowerCase().includes('bài test toàn diện naviu')) { // Cập nhật điều kiện cho tiêu đề mới
    return '/profile/test/naviu-mbti/do-test';
  }
  // Thêm các bài test khác ở đây
  return '#'; // Đường dẫn mặc định
};

const TestSection = ({ title, tests }: { title: string; tests: any[] }) => (
  <section>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent className="-ml-4">
        {tests.map((test, index) => (
          <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="p-1 h-full">
              <TestCard test={{ ...test, link: getTestLink(test.title) }} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  </section>
);

const TestHubView = () => {
  return (
    <div className="space-y-12">
      <TestSection title="Hiểu Mình" tests={testHubData.hieuMinh} />
      <TestSection title="Hiểu Trường" tests={testHubData.hieuTruong} />
      <TestSection title="Hiểu Ngành" tests={testHubData.hieuNganh} />
    </div>
  );
};

export default TestHubView;