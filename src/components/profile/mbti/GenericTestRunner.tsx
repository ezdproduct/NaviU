import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
  options: { key: string; text: string }[];
}

interface GenericTestRunnerProps {
  title: string;
  questions: Question[];
  onSubmit: (answers: { [key: string]: string }) => void;
  isSubmitting: boolean;
}

const GenericTestRunner: React.FC<GenericTestRunnerProps> = ({
  title,
  questions,
  onSubmit,
  isSubmitting,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswer = (qid: string, choice: string) => {
    setAnswers({ ...answers, [qid]: choice });
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
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

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Vui lòng trả lời hết tất cả câu hỏi!");
      return;
    }
    onSubmit(answers);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
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
              disabled={isSubmitting || !allAnswered}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Đang nộp..." : "Hoàn thành & Xem kết quả"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default GenericTestRunner;