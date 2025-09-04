import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MBTIQuiz from './mbti/MBTIQuiz'; // Import the new MBTIQuiz component

const MBTITestApp = () => {
  const { user } = useAuth();
  const token = user ? localStorage.getItem('jwt_token') : null; // Lấy token từ localStorage

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bạn chưa đăng nhập</h2>
          <p className="text-gray-600">Vui lòng đăng nhập để làm bài trắc nghiệm MBTI.</p>
        </div>
      </div>
    );
  }

  return <MBTIQuiz token={token} />;
};

export default MBTITestApp;