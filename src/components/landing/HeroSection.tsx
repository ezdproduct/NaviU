import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 md:py-32 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="/naviU.png" alt="Background pattern" className="w-full h-full object-cover" style={{ filter: 'grayscale(100%)' }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
          Khám phá Tiềm năng Sự nghiệp của bạn cùng NaviU
        </h1>
        <p className="text-lg md:text-xl mb-10 opacity-90 animate-fade-in-up delay-200">
          Hệ thống định hướng toàn diện giúp bạn thấu hiểu bản thân,<br /> chọn ngành, chọn trường và kết nối chuyên gia.
        </p>
        <Link to="/register">
          <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up delay-400">
            Bắt đầu hành trình của bạn
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;