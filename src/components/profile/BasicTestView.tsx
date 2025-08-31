import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { questionsData, Question } from '@/data/questionsData'; // Import questionsData

interface BasicTestViewProps {
  onFinishTest: (answers: { [key: string]: string }) => void;
}

const BasicTestView = ({ onFinishTest }: BasicTestViewProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    // Kiểm tra xem tất cả các câu hỏi đã được trả lời chưa
    const allAnswered = questionsData.every(q => selectedAnswers[q.id]);
    if (!allAnswered) {
      alert('Vui lòng trả lời tất cả các câu hỏi trước khi hoàn thành!');
      return;
    }
    onFinishTest(selectedAnswers);
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm min-h-[calc(100vh-6rem)] p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Trắc nghiệm Cơ bản</h3>
      <p className="text-gray-600 text-center mb-8">
        Trả lời các câu hỏi dưới đây để khám phá thêm về bản thân.
      </p>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 px-2">
        {questionsData.map((question: Question, qIndex: number) => (
          <div key={question.id} className="bg-gray-50 p-4 rounded-lg border">
            <p className="font-semibold text-gray-800 mb-3">
              Câu {qIndex + 1}: {question.text}
            </p>
            <RadioGroup
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              value={selectedAnswers[question.id] || ''}
            >
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2 py-2">
                  <RadioGroupItem value={option} id={`${question.id}-option-${oIndex}`} />
                  <Label htmlFor={`${question.id}-option-${oIndex}`} className="text-gray-700 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          Hoàn thành Trắc nghiệm Cơ bản
        </Button>
      </div>
    </div>
  );
};

export default BasicTestView;