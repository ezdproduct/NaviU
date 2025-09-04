import React from 'react';
import { Clock, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MBTITestResultViewProps {
  result: any;
  resetTest: () => void;
}

const MBTITestResultView: React.FC<MBTITestResultViewProps> = ({ result, resetTest }) => {
  if (!result) return null;

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'INTJ': 'bg-purple-600', 'INTP': 'bg-blue-600', 'ENTJ': 'bg-red-600', 'ENTP': 'bg-orange-600',
      'INFJ': 'bg-green-600', 'INFP': 'bg-teal-600', 'ENFJ': 'bg-pink-600', 'ENFP': 'bg-yellow-600',
      'ISTJ': 'bg-gray-700', 'ISFJ': 'bg-indigo-600', 'ESTJ': 'bg-red-700', 'ESFJ': 'bg-pink-700',
      'ISTP': 'bg-gray-600', 'ISFP': 'bg-green-500', 'ESTP': 'bg-orange-700', 'ESFP': 'bg-yellow-700'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-green-50 to-blue-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold mb-4 ${getTypeColor(result.mbti_type)}`}>
            {result.mbti_type}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Kết Quả MBTI Của Bạn
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">{result.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-xl p-6 text-center">
            <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {result.completion_rate}%
            </div>
            <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
          </Card>
          
          <Card className="rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">Thời gian làm bài</div>
          </Card>
          
          <Card className="rounded-xl p-6 text-center">
            <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {result.answered_questions}/{result.total_questions}
            </div>
            <div className="text-sm text-gray-600">Câu đã trả lời</div>
          </Card>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(result.details).map(([key, detail]: [string, any]) => {
            const titles: { [key: string]: string } = {
              'extraversion_introversion': 'Hướng ngoại - Hướng nội',
              'sensing_intuition': 'Cảm giác - Trực giác', 
              'thinking_feeling': 'Lý trí - Cảm xúc',
              'judging_perceiving': 'Phán đoán - Linh hoạt'
            };

            return (
              <Card key={key} className="rounded-xl p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {titles[key]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3">
                    {Object.entries(detail).filter(([k, v]) => k !== 'tendency').map(([type, percentage]: [string, any]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{type}:</span>
                        <div className="flex items-center">
                          <Progress value={parseFloat(percentage)} className="w-24 h-2 mr-3" />
                          <span className="text-sm font-medium text-gray-800">{percentage}</span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200 mt-4">
                      <span className="text-sm text-blue-700 font-medium">
                        Xu hướng: {detail.tendency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="text-center">
          <Button
            onClick={resetTest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Làm lại test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MBTITestResultView;