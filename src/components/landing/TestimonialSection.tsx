import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import TestimonialCard from './TestimonialCard';
import { testimonialData } from '@/data/testimonialData';

const TestimonialSection = () => {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề và mô tả */}
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Những gì người dùng nói về NaviU</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Chúng tôi cung cấp mọi lợi thế có thể đơn giản hóa mọi hỗ trợ tài chính và ngân hàng của bạn mà không gặp thêm bất kỳ vấn đề nào.
            </p>
        </div>

        {/* Vùng chứa slider */}
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {testimonialData.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;