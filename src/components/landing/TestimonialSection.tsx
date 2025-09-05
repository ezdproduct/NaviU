import React from 'react';
// Removed Carousel imports as we are switching to a grid layout
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

        {/* Vùng chứa grid cho lời chứng thực */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialData.map((testimonial, index) => (
              <div key={index} className="h-full">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;