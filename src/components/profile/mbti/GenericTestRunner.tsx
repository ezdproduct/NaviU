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
    // Tự động chuyển câu hỏi sau khi chọn, nếu không phải câu cuối cùng
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300); // Thêm độ trễ nhỏ để người dùng kịp nhìn thấy lựa chọn
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
        <CardHeader className="p-6 pb-0">
          <p className="text-sm text-gray-500 mb-2">Question {currentQuestionIndex + 1}</p>
          <CardTitle className="text-xl font-bold text-gray-800 text-left mb-6 min-h-[60px]">
            {currentQuestion.text}
          </CardTitle>
          <Progress value={progress} className="w-full mt-4 h-2" />
        </CardHeader>

        <CardContent className="p-6 md:p-8 pt-0">
          <div className="grid grid-cols-1 gap-4">
            {(currentQuestion.options || []).map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswer(currentQuestion.id, option.key)}
                className={cn(
                  "flex items-center justify-between w-full p-4 rounded-lg border transition-all duration-200",
                  answers[currentQuestion.id] === option.key
                    ? "bg-indigo-600 text-white border-indigo-600" // Selected state
                    : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200" // Unselected state
                )}
              >
                <div className={cn(
                  "flex items-center gap-4",
                  answers[currentQuestion.id] === option.key && "border-l-4 border-white pl-2 -ml-2" // Purple bar on left
                )}>
                  <span className="text-base font-medium">{option.text}</span>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  answers[currentQuestion.id] === option.key
                    ? "border-white bg-white" // Selected radio outer
                    : "border-gray-400" // Unselected radio outer
                )}>
                  {answers[currentQuestion.id] === option.key && (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> // Selected radio inner dot
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>

        <CardFooter className="p-6 flex justify-between items-center bg-gray-50 rounded-b-2xl">
          <Button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="text-gray-600 hover:bg-gray-100 border-gray-300 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion?.id]}
              variant="outline"
              className="text-gray-600 hover:bg-gray-100 border-gray-300 rounded-lg"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !allAnswered}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg"
            >
              {isSubmitting ? "Submitting..." : "Finish"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default GenericTestRunner;