import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const API_URL = "https://naviu-backend.ezd.vn/wp-json/mbti/v1";

interface Question {
  id: string;
  text: string;
  choices?: {
    a?: { label?: string };
    b?: { label?: string };
  };
}

interface Result {
  result: string;
  [key: string]: any;
}

export default function MBTITestApp() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const token = localStorage.getItem("jwt_token");

  // Lấy danh sách câu hỏi
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`${API_URL}/questions`)
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.error("Error loading questions", err);
        setError("Không thể tải câu hỏi. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Xử lý chọn đáp án
  const handleAnswer = (qid: string, choice: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: choice }));
  };

  // Gửi câu trả lời
  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Vui lòng trả lời tất cả các câu hỏi.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập để nộp bài.");
      }
      const res = await axios.post(
        `${API_URL}/submit`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResult(res.data);
    } catch (err: any) {
      console.error("Error submitting answers", err);
      setError(err.response?.data?.message || "Có lỗi khi gửi câu trả lời.");
    }
    setLoading(false);
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Trắc nghiệm MBTI</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          {/* Hiển thị câu hỏi */}
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="p-4 border rounded-lg bg-gray-50/50">
                <p className="font-medium">{q.id}. {q.text}</p>
                <div className="mt-3 space-x-4">
                  <Button
                    onClick={() => handleAnswer(q.id, "a")}
                    variant={answers[q.id] === "a" ? "default" : "outline"}
                    size="sm"
                  >
                    {q.choices?.a?.label || "Lựa chọn A"}
                  </Button>
                  <Button
                    onClick={() => handleAnswer(q.id, "b")}
                    variant={answers[q.id] === "b" ? "default" : "outline"}
                    size="sm"
                  >
                    {q.choices?.b?.label || "Lựa chọn B"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Hiển thị kết quả */}
          {result && (
            <div className="mt-6 p-4 border rounded-lg bg-green-50">
              <h2 className="text-xl font-semibold">Kết quả: {result.result}</h2>
              <pre className="text-sm mt-2 bg-white p-3 rounded-md overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          {/* Nút submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading || Object.keys(answers).length < questions.length}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Đang xử lý..." : "Gửi câu trả lời & Xem kết quả"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}