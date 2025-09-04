import React from 'react';
import { Clock, User, CheckCircle, ArrowRight, ArrowLeft, BarChart3, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface MBTITestListViewProps {
  tests: any[];
  loading: boolean;
  error: string;
  startTest: (testId: string) => void;
  setCurrentView: (view: string) => void;
  apiStatus: 'loading' | 'success' | 'error';
}

const MBTITestListView: React.FC<MBTITestListViewProps> = ({
  tests,
  loading,
  error,
  startTest,
  setCurrentView,
  apiStatus,
}) => {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      {apiStatus === 'error' && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setCurrentView('config')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center text-sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Cấu hình API
          </Button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Trắc Nghiệm Tính Cách MBTI
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Khám phá tính cách của bạn qua bài test tâm lý học nổi tiếng
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {tests.length > 0 ? (
              tests.map((test: any) => (
                <Card key={test.id} className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <CardContent className="p-0 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex-1 mb-4 sm:mb-0">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{test.title}</CardTitle>
                      <p className="text-gray-600 mb-4">{test.description}</p>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {test.meta.duration} phút
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-4 h-4 mr-1" />
                          {test.total_questions} câu hỏi
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          {test.meta.difficulty_level}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => startTest(test.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                    >
                      Bắt đầu test
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="rounded-xl shadow-lg p-6 text-center">
                <CardTitle className="text-xl font-bold text-gray-800 mb-2">Không có bài test nào</CardTitle>
                <p className="text-gray-600">
                  Không tìm thấy bài test nào. Vui lòng kiểm tra lại cấu hình API hoặc thử lại sau.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MBTITestListView;