import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useBlocker } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ConfirmNavigationModal from '@/components/ConfirmNavigationModal';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import BasicTestView from './BasicTestView';
import MBTITestApp from './MBTITestApp'; // Import MBTITestApp
import { questionsData, Question } from '@/data/questionsData';

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
  const [testMode, setTestMode] = useState<'ai' | 'basic' | 'mbti'>('ai'); // Thêm 'mbti' vào state
  const [basicTestAnswers, setBasicTestAnswers] = useState<{ [key: string]: string } | null>(null);
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
        setMessages([{ sender: 'ai', text: questionsData[0].text }]);
        setIsAiTyping(false);
      }, 1000);
    } else {
      // Reset AI chat state when switching modes
      setMessages([]);
      setCurrentQuestionIndex(0);
      setIsAiTyping(false);
    }
  }, [testMode]); // Chỉ chạy khi testMode thay đổi

  const handleAnswerSelect = (answer: string) => {
    setMessages((prev) => [...prev, { sender: 'user', text: answer }]);
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < questionsData.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setIsAiTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'ai', text: questionsData[nextQuestionIndex].text }]);
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
    if (testMode === 'basic' && answers) {
      setBasicTestAnswers(answers);
    }
    setShowConfirmModal(true);
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

        questionsData.forEach((q, index) => {
            submissionData[`Question ${index + 1}`] = userAnswers[index] || '';
        });
        submissionData['Test Type'] = 'AI Chat Test';
      } else if (testMode === 'basic' && basicTestAnswers) {
        Object.keys(basicTestAnswers).forEach(questionId => {
          submissionData[questionId] = basicTestAnswers[questionId];
        });
        submissionData['Test Type'] = 'Basic Test';
      } else {
        submissionData['Test Type'] = 'Unknown';
        submissionData['Status'] = 'Completed (No answers collected)';
      }

      const response = await fetch('https://script.google.com/macros/s/AKfycbzDnYuQtbgUeqqz_XfAQ2MhEP7xi3-W1eHAMcRgDqPbD18YATP1TLVJQ4tBx4mOhW3Y/exec', { // Updated Google Sheet URL
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
      setBasicTestAnswers(null);
      navigate('/profile/dashboard');
    }
  };

  const currentOptions = questionsData[currentQuestionIndex]?.options || [];
  const isAiTestFinished = currentQuestionIndex >= questionsData.length;

  // Xác định khi nào bài test AI hoặc Basic đang diễn ra
  const isAiOrBasicTestInProgress = (testMode === 'ai' && currentQuestionIndex > 0 && !isAiTestFinished) ||
                                   (testMode === 'basic' && Object.keys(basicTestAnswers || {}).length > 0);

  // Sử dụng useBlocker để chặn điều hướng
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isAiOrBasicTestInProgress &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowConfirmModal(true);
    }
  }, [blocker.state]);

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  };

  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  return (
    <div className="flex flex-col bg-white flex-1">
      {/* Header cho các nút chuyển đổi chế độ test */}
      <div className="p-4 border-b flex justify-center gap-4 bg-gray-50 flex-wrap">
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
        <Button
          variant={testMode === 'mbti' ? 'default' : 'outline'}
          onClick={() => setTestMode('mbti')}
          className={cn(testMode === 'mbti' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50')}
        >
          Trắc nghiệm MBTI
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
          <div className="bg-gray-50 border-t p-4">
            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
              {!isAiTyping && !isAiTestFinished && currentOptions.map((option, index) => (
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
              <Button onClick={() => handleFinishTest()} disabled={isSubmitting || !isAiTestFinished}>
                {isSubmitting ? 'Đang gửi...' : 'Kết thúc'}
              </Button>
            </div>
          </div>
        </>
      ) : testMode === 'basic' ? (
        <BasicTestView onFinishTest={handleFinishTest} />
      ) : ( // testMode === 'mbti'
        <MBTITestApp />
      )}

      <ConfirmNavigationModal
        isOpen={showConfirmModal}
        onClose={handleCancelNavigation}
        onConfirm={handleConfirmNavigation}
      />
    </div>
  );
};

export default DoTestView;