import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { WP_BASE_URL } from '@/lib/auth/api';
import GenericTestRunner from "./GenericTestRunner";
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';

interface Question {
  id: string;
  text: string;
  options: { key: string; text: string }[];
}

interface MBTIQuizProps {
  token: string;
}

const API_URL = `${WP_BASE_URL}/wp-json/mbti/v1`;

export default function MBTIQuiz({ token }: MBTIQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/questions`);
        if (!res.ok) {
          throw new Error(`Lỗi HTTP! Trạng thái: ${res.status}`);
        }
        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        console.error("Error fetching MBTI questions:", err);
        setError(err.message || 'Không thể tải câu hỏi MBTI.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const handleSubmit = async (answers: { [key: string]: string }) => {
    setSubmitted(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to submit answers: ${res.status}`);
      }
      await res.json();
      
      showSuccess("Bài test đã hoàn thành! Kết quả của bạn đã được cập nhật.");
      setTimeout(() => {
        navigate('/profile/dashboard', { replace: true });
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi nộp bài test.');
      setSubmitted(false); // Chỉ reset khi có lỗi
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-red-50 flex items-center justify-center p-4">
        <Card className="rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</CardTitle>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Thử lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <GenericTestRunner
      title="Trắc nghiệm MBTI"
      questions={questions}
      onSubmit={handleSubmit}
      isSubmitting={submitted}
    />
  );
}