import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WP_BASE_URL } from '@/lib/auth/api';
import MBTIResult from "./MBTIResult";
import { cn } from "@/lib/utils";

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
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<"quiz" | "result">("quiz");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  const handleAnswer = (qid: string, choice: string) => {
    setAnswers({ ...answers, [qid]: choice });
    // Tự động chuyển câu hỏi tiếp theo sau khi trả lời
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300); // Thêm một chút delay để người dùng thấy lựa chọn của mình
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Vui lòng trả lời hết tất cả câu hỏi!");
      return;
    }
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
      setStep("result");
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi nộp bài test.');
    } finally {
      setSubmitted(false);
    }
  };

  const handleRetake = () => {
    window.location.reload();
  };

  if (step === "result") {
    return <MBTIResult token={token} onRetake={handleRetake} />;
  }

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
          <Button onClick={handleRetake} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Thử lại
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold text-center">Trắc nghiệm MBTI</CardTitle>
          <CardDescription className="text-center">
            Câu {currentQuestionIndex + 1}/{questions.length}
          </CardDescription>
          <Progress value={progress} className="w-full mt-4 h-2" />
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {currentQuestion && (
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-6 text-center min-h-[60px]">
                {currentQuestion.text}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option.key}
                    onClick={() => handleAnswer(currentQuestion.id, option.key)}
                    variant="outline"
                    className={cn(
                      "h-auto text-wrap justify-center text-center p-4 text-base transition-all duration-200",
                      answers[currentQuestion.id] === option.key
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 flex justify-between items-center bg-gray-50 rounded-b-2xl">
          <Button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Câu trước
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion?.id]}
            >
              Câu tiếp theo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitted || !allAnswered}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitted ? "Đang nộp..." : "Hoàn thành & Xem kết quả"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}