import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ConfirmNavigationModal from '@/components/ConfirmNavigationModal';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import BasicTestView from './BasicTestView'; // Import BasicTestView
import { questionsData, Question } from '@/data/questionsData'; // Import questionsData và Question type

type Message = {
  sender: 'ai' | 'user';
  text: string;
};

const DoTestView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testMode, setTestMode] = useState<'ai' | 'basic'>('ai'); // State mới để quản lý chế độ test
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  useEffect(() => {
    if (testMode === 'ai' && messages.length === 0) {
      setIsAiTyping(true);
      setTimeout(() => {
        setMessages([{ sender: 'ai', text: questionsData[0].text }]); // Sử dụng questionsData
        setIsAiTyping(false);
      }, 1000);
    } else if (testMode === 'basic') {
      // Reset AI chat if switching to basic mode
      setMessages([]);
      setCurrentQuestionIndex(0);
      setIsAiTyping(false);
    }
  }, [testMode, messages.length]);

  const handleAnswerSelect = (answer: string) => {
    setMessages((prev) => [...prev, { sender: 'user', text: answer }]);
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < questionsData.length) { // Sử dụng questionsData
      setCurrentQuestionIndex(nextQuestionIndex);
      setIsAiTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'ai', text: questionsData[nextQuestionIndex].text }]); // Sử dụng questionsData
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

  const handleFinishTest = async (answers?: { [key: string]: string }) => {
    setShowConfirmModal(true);
    // Lưu trữ câu trả lời tạm thời nếu có để gửi sau khi xác nhận
    if (answers) {
      // Logic để xử lý answers từ BasicTestView nếu cần
      // Hiện tại, chúng ta sẽ gửi dữ liệu từ AI chat hoặc một payload đơn giản
    }
  };

  const handleConfirmFinishTest = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    const loadingToastId = showLoading('Đang gửi kết quả bài test...');

    try {
      let submissionData: { [key: string]: string } = {
        username: user?.username || 'Guest',
        timestamp: new Date().toISOString(),
      };

      if (testMode === 'ai') {
        const userAnswers = messages
          .filter(msg => msg.sender === 'user')
          .map(msg => msg.text);

        questionsData.forEach((q, index) => { // Sử dụng questionsData
            submissionData[`Question ${index + 1}`] = userAnswers[index] || '';
        });
      } else {
        // Logic để lấy câu trả lời từ BasicTestView nếu cần
        // Hiện tại, chỉ gửi một thông báo đơn giản cho BasicTestView
        submissionData['Test Type'] = 'Basic Test';
        submissionData['Status'] = 'Completed';
      }

      const response = await fetch('https://script.google.com/macros/s/AKfycbzDnYuQtbgUeqqz_XfAQ2MhEP7xi3-W1eHAMcRgDqPbD18YATPnTLVJQ4tBx4mOhW3Y/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit test results to Google Sheet.');
      }

      showSuccess('Kết quả bài test đã được gửi thành công!');

    } catch (error) {
      console.error('Error submitting test results:', error);
      showError('Có lỗi xảy ra khi gửi kết quả bài test. Vui lòng thử lại.');
    } finally {
      dismissToast(loadingToastId);
      setIsSubmitting(false);
      navigate('/profile/dashboard'); // Chuyển hướng đến tab dashboard
    }
  };

  const currentOptions = questionsData[currentQuestionIndex]?.options || []; // Sử dụng questionsData
  const isTestFinished = currentQuestionIndex >= questionsData.length; // Sử dụng questionsData

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm min-h-[calc(100vh-6rem)]">
      {/* Header cho các nút chuyển đổi chế độ test */}
      <div className="p-4 border-b flex justify-center gap-4 bg-gray-50 rounded-t-2xl">
        <Button
          variant={testMode === 'ai' ? 'default' : 'outline'}
          onClick={() => setTestMode('ai')}
          className={cn(testMode === 'ai' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50')}
        >
          Làm bài test với AI
        </Button>
        <Button
          variant={testMode === 'basic' ? 'default' : 'outline'}
          onClick={() => setTestMode('basic')}
          className={cn(testMode === 'basic' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50')}
        >
          Trắc nghiệm cơ bản
        </Button>
      </div>

      {testMode === 'ai' ? (
        <>
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
                  disabled={isSubmitting}
                >
                  {option}
                </Button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Input
                type="text"
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-grow"
                disabled
              />
              <Button onClick={handleFinishTest} disabled={isSubmitting || !isTestFinished}>
                {isSubmitting ? 'Đang gửi...' : 'Kết thúc'}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <BasicTestView onFinishTest={handleFinishTest} />
      )}

      <ConfirmNavigationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmFinishTest}
      />
    </div>
  );
};

export default DoTestView;