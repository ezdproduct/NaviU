import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ConfirmNavigationModal from '@/components/ConfirmNavigationModal';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast'; // Import toast utilities

type Message = {
  sender: 'ai' | 'user';
  text: string;
};

type Question = {
  text: string;
  options: string[];
};

const questions: Question[] = [
  {
    text: 'Chào bạn, chúng ta hãy bắt đầu nhé! Khi đối mặt với một vấn đề phức tạp, bạn thường làm gì đầu tiên?',
    options: [
      'Phân tích vấn đề một cách logic.',
      'Tìm kiếm cảm hứng từ những ý tưởng mới.',
      'Xem xét vấn đề ảnh hưởng đến mọi người.',
      'Bắt tay vào hành động ngay lập tức.',
    ],
  },
  {
    text: 'Thật thú vị! Khi làm việc nhóm, bạn thích vai trò nào hơn?',
    options: [
      'Người lên kế hoạch và tổ chức.',
      'Người đưa ra ý tưởng sáng tạo.',
      'Người kết nối và tạo sự hòa hợp.',
      'Người thực thi và giải quyết vấn đề.',
    ],
  },
  {
    text: 'Cảm ơn bạn. Cuối cùng, điều gì mang lại cho bạn nhiều năng lượng nhất?',
    options: [
      'Hoàn thành một công việc một cách hoàn hảo.',
      'Khám phá một khả năng mới.',
      'Giúp đỡ hoặc truyền cảm hứng cho người khác.',
      'Trải nghiệm một điều gì đó mới mẻ.',
    ],
  },
];

const DoTestView = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy thông tin người dùng từ AuthContext
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State để quản lý trạng thái gửi dữ liệu
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      setIsAiTyping(true);
      setTimeout(() => {
        setMessages([{ sender: 'ai', text: questions[0].text }]);
        setIsAiTyping(false);
      }, 1000);
    }
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setMessages((prev) => [...prev, { sender: 'user', text: answer }]);
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setIsAiTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'ai', text: questions[nextQuestionIndex].text }]);
        setIsAiTyping(false);
      }, 1500);
    } else {
      setIsAiTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'ai', text: 'Cảm ơn bạn đã hoàn thành bài test! Báo cáo của bạn sẽ sớm được cập nhật.' }]);
        setIsAiTyping(false);
      }, 1500);
    }
  };

  const handleFinishTest = () => {
    setShowConfirmModal(true); // Hiển thị modal xác nhận khi nhấp nút Kết thúc
  };

  const handleConfirmFinishTest = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    const loadingToastId = showLoading('Đang gửi kết quả bài test...');

    try {
      const userAnswers = messages
        .filter(msg => msg.sender === 'user')
        .map(msg => msg.text);

      const submissionData: { [key: string]: string } = {
        username: user?.username || 'Guest', // Sử dụng tên người dùng hoặc 'Guest' nếu không có
        timestamp: new Date().toISOString(),
      };

      // Gán từng câu trả lời vào các trường Question 1, Question 2, ...
      questions.forEach((q, index) => {
          submissionData[`Question ${index + 1}`] = userAnswers[index] || '';
      });

      const response = await fetch('https://script.google.com/macros/s/AKfycbzDnYuQtbgUeqqz_XfAQ2MhEP7xi3-W1eHAMcRgDqPbD18YATPgTLVJQ4tBx4mOhW3Y/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit test results to Google Sheet.');
      }

      // const result = await response.json(); // Google Apps Script thường trả về text/html, không phải JSON
      // console.log('Google Sheet submission result:', result);
      showSuccess('Kết quả bài test đã được gửi thành công!');

    } catch (error) {
      console.error('Error submitting test results:', error);
      showError('Có lỗi xảy ra khi gửi kết quả bài test. Vui lòng thử lại.');
    } finally {
      dismissToast(loadingToastId);
      setIsSubmitting(false);
      navigate('/profile', { state: { initialView: 'dashboard' } }); // Chuyển hướng đến tab dashboard
    }
  };

  const currentOptions = questions[currentQuestionIndex]?.options || [];
  const isTestFinished = currentQuestionIndex >= questions.length; // Vẫn giữ để AI biết khi nào kết thúc tin nhắn

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm min-h-[calc(100vh-6rem)]">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn('flex items-end gap-2', {
              'justify-start': msg.sender === 'ai',
              'justify-end': msg.sender === 'user',
            })}
          >
            {msg.sender === 'ai' && (
              <img src="/logo.png" alt="AI Logo" className="h-8 w-8 rounded-full" />
            )}
            <div
              className={cn('max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 text-sm sm:text-base', {
                'bg-gray-100 text-gray-800 rounded-bl-none': msg.sender === 'ai',
                'bg-blue-500 text-white rounded-br-none': msg.sender === 'user',
              })}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex items-end gap-2 justify-start">
            <img src="/logo.png" alt="AI Logo" className="h-8 w-8 rounded-full" />
            <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 rounded-bl-none">
              <div className="flex items-center justify-center space-x-1">
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-50 border-t p-4 rounded-b-2xl">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
          {!isAiTyping && !isTestFinished && currentOptions.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto text-wrap justify-start text-left bg-white"
              onClick={() => handleAnswerSelect(option)}
              disabled={isSubmitting} // Vô hiệu hóa nút trong khi gửi
            >
              {option}
            </Button>
          ))}
        </div>
        {/* Thanh nhập liệu hình thức */}
        <div className="mt-4 flex items-center gap-2">
          <Input
            type="text"
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-grow"
            disabled // Vô hiệu hóa input vì nó chỉ mang tính hình thức
          />
          <Button onClick={handleFinishTest} disabled={isSubmitting || !isTestFinished}>
            {isSubmitting ? 'Đang gửi...' : 'Kết thúc'}
          </Button>
        </div>
      </div>

      <ConfirmNavigationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmFinishTest}
      />
    </div>
  );
};

export default DoTestView;