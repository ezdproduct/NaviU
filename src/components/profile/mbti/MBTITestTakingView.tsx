import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface MBTITestTakingViewProps {
  currentTest: any;
  currentQuestion: number;
  answers: { [key: string]: string };
  loading: boolean;
  handleAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitTest: () => void;
}

const MBTITestTakingView: React.FC<MBTITestTakingViewProps> = ({
  currentTest,
  currentQuestion,
  answers,
  loading,
  handleAnswer,
  nextQuestion,
  prevQuestion,
  submitTest,
}) => {
  if (!currentTest) return null;

  const question = currentTest.questions[currentQuestion];
  const progressValue = ((currentQuestion + 1) / currentTest.questions.length) * 100;
  const isLastQuestion = currentQuestion === currentTest.questions.length - 1;
  const currentAnswer = answers[question.id];

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Card className="rounded-xl shadow-lg p-6 mb-6">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">{currentTest.title}</CardTitle>
              <span className="text-sm text-gray-500">
                Câu {currentQuestion + 1}/{currentTest.questions.length}
              </span>
            </div>
            
            {/* Progress bar */}
            <Progress value={progressValue} className="w-full h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="rounded-xl shadow-lg p-8 mb-6">
          <CardContent className="p-0">
            <div className="mb-6">
              <span className="text-sm text-blue-600 font-medium">
                Nhóm: {question.group}
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-2">
                {question.question_text}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option: any) => (
                <Button
                  key={option.key}
                  onClick={() => handleAnswer(question.id, option.value)}
                  variant="outline"
                  className={`w-full h-auto text-left p-4 rounded-lg border-2 transition-all justify-start whitespace-normal ${
                    currentAnswer === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-3">
                    {option.key.toUpperCase()}.
                  </span>
                  {option.text}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            variant="ghost"
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentQuestion === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Câu trước
          </Button>

          <div className="flex space-x-3">
            {!isLastQuestion ? (
              <Button
                onClick={nextQuestion}
                disabled={!currentAnswer}
                className={`flex items-center px-6 py-3 rounded-lg font-medium ${
                  currentAnswer
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Câu tiếp theo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={submitTest}
                disabled={loading || Object.keys(answers).length === 0}
                className={`flex items-center px-6 py-3 rounded-lg font-medium ${
                  loading || Object.keys(answers).length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Hoàn thành
              </Button>
            )}
          </div>
        </div>

        {/* Answered questions indicator */}
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Đã trả lời: {Object.keys(answers).length}/{currentTest.questions.length} câu
          </span>
        </div>
      </div>
    </div>
  );
};

export default MBTITestTakingView;