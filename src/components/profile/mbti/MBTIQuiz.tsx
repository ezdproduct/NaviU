import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { WP_BASE_URL } from '@/lib/auth/api'; // Import base URL
import MBTIResult from "./MBTIResult"; // Import MBTIResult component

interface Question {
  id: string;
  text: string;
  options: { key: string; text: string }[]; // Assuming options are structured like this
}

interface MBTIQuizProps {
  token: string;
}

const API_URL = `${WP_BASE_URL}/wp-json/mbti/v1`;

export default function MBTIQuiz({ token }: MBTIQuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState<"quiz" | "result">("quiz"); // "quiz" | "result"
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách câu hỏi từ backend
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
        // API trả về một mảng trực tiếp, gán thẳng vào state
        setQuestions(data);
      } catch (err: any) {
        console.error("Error fetching MBTI questions:", err);
        setError(err.message || 'Không thể tải câu hỏi MBTI. Vui lòng kiểm tra kết nối hoặc cấu hình API.');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // Xử lý chọn đáp án
  const handleAnswer = (qid: string, choice: string) => {
    setAnswers({ ...answers, [qid]: choice });
  };

  // Gửi kết quả
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

      const data = await res.json();
      // Giả sử API submit trả về { success: true } hoặc kết quả trực tiếp
      console.log("MBTI Result:", data);
      setStep("result");
    } catch (err: any) {
      console.error("MBTI Submit Error:", err);
      setError(err.message || 'Có lỗi xảy ra khi nộp bài test. Vui lòng thử lại.');
    } finally {
      setSubmitted(false);
    }
  };

  const handleRetake = () => {
    setStep("quiz");
    setAnswers({});
    setSubmitted(false);
    setLoading(true);
    setError(null);
    // Re-fetch questions by re-triggering useEffect
    // This is a simple way; a more robust solution might involve a dedicated fetch function
    window.location.reload(); // For simplicity, a full reload to reset state and re-fetch
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

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6 min-h-[calc(100vh-6rem)]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Trắc nghiệm MBTI</CardTitle>
        <CardDescription>Vui lòng trả lời tất cả các câu hỏi để khám phá tính cách của bạn.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {questions.map((q) => (
          <Card
            key={q.id}
            className="p-4 rounded-xl hover:shadow-md transition"
          >
            <p className="font-medium text-gray-800 mb-3">{q.id}. {q.text}</p>
            <RadioGroup
              onValueChange={(value) => handleAnswer(q.id, value)}
              value={answers[q.id] || ''}
              className="flex flex-col space-y-2"
            >
              {q.options && q.options.map((option) => (
                <div key={option.key} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.key} id={`${q.id}-${option.key}`} />
                  <Label htmlFor={`${q.id}-${option.key}`} className="text-gray-700 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>
        ))}
      </CardContent>

      <div className="text-center p-4">
        <Button
          onClick={handleSubmit}
          disabled={submitted || Object.keys(answers).length < questions.length}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {submitted ? "Đang nộp..." : "Hoàn thành"}
        </Button>
      </div>
    </div>
  );
}