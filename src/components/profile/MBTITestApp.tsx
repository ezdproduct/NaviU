import React, { useState, useEffect } from 'react';
import { Clock, User, CheckCircle, ArrowRight, ArrowLeft, BarChart3, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MBTITestApp = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'test', 'result', 'config'
  const [tests, setTests] = useState([]);
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiUrl, setApiUrl] = useState<string>(
    localStorage.getItem('mbtiApiUrl') || 'https://naviu-backend.ezd.vn/wp-json/tests/v1'
  );

  useEffect(() => {
    localStorage.setItem('mbtiApiUrl', apiUrl);
  }, [apiUrl]);

  useEffect(() => {
    if (currentView === 'list') {
      fetchTests();
    }
  }, [currentView, apiUrl]); // Re-fetch tests when view is list or API URL changes

  const fetchTests = async () => {
    setLoading(true);
    setError('');
    setApiStatus('loading');
    try {
      const response = await fetch(`${apiUrl}/list`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API responded with status ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setTests(data.data);
        setApiStatus('success');
      } else {
        throw new Error(data.message || 'Failed to fetch tests from API.');
      }
    } catch (err: any) {
      console.error("Error fetching tests:", err);
      setError(err.message || 'Không thể tải danh sách bài test. Vui lòng kiểm tra cấu hình API.');
      setApiStatus('error');
    }
    setLoading(false);
  };

  const startTest = async (testId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/${testId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API responded with status ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setCurrentTest(data.data);
        setCurrentQuestion(0);
        setAnswers({});
        setStartTime(Date.now());
        setCurrentView('test');
      } else {
        throw new Error(data.message || 'Không thể tải bài test.');
      }
    } catch (err: any) {
      console.error("Error starting test:", err);
      setError(err.message || 'Không thể tải bài test.');
    }
    setLoading(false);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentTest && currentQuestion < currentTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = async () => {
    if (!currentTest || Object.keys(answers).length === 0) {
      setError('Vui lòng trả lời ít nhất một câu hỏi');
      return;
    }

    setLoading(true);
    setError('');
    const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    try {
      const response = await fetch(`${apiUrl}/${currentTest.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          time_taken: timeTaken
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API responded with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        setCurrentView('result');
      } else {
        throw new Error(data.message || 'Có lỗi xảy ra khi nộp bài');
      }
    } catch (err: any) {
      console.error("Error submitting test:", err);
      setError(err.message || 'Không thể nộp bài test.');
    }
    setLoading(false);
  };

  const resetTest = () => {
    setCurrentView('list');
    setCurrentTest(null);
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setError('');
    setApiStatus('loading'); // Reset API status to re-fetch
  };

  // Test List View
  const TestListView = () => (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
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

  // Test Taking View
  const TestView = () => {
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

  // Result View
  const ResultView = () => {
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

  // Api Configuration View
  const ApiConfigView = () => {
    const [tempApiUrl, setTempApiUrl] = useState(apiUrl);

    const handleSave = () => {
      setApiUrl(tempApiUrl);
      setCurrentView('list'); // Go back to list view after saving
      // fetchTests will be triggered by useEffect due to apiUrl change
    };

    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
        <Card className="rounded-xl p-8 max-w-md w-full text-center">
          <CardTitle className="text-2xl font-bold text-gray-800 mb-4">Cấu hình API</CardTitle>
          <p className="text-gray-600 mb-6">
            Vui lòng nhập URL của API WordPress để tải các bài test.
          </p>
          <div className="space-y-4 mb-6">
            <Label htmlFor="apiUrl" className="sr-only">URL API</Label>
            <Input
              id="apiUrl"
              type="url"
              placeholder="Ví dụ: https://your-wordpress-site.com/wp-json/tests/v1"
              value={tempApiUrl}
              onChange={(e) => setTempApiUrl(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
              Lưu & Tải lại
            </Button>
            <Button variant="outline" onClick={() => setCurrentView('list')}>
              Hủy
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // Error display
  if (error && currentView !== 'config') { // Only show error if not in config view
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-red-50 flex items-center justify-center p-4">
        <Card className="rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</CardTitle>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => setCurrentView('config')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 mr-2" />
            Cấu hình API
          </Button>
        </Card>
      </div>
    );
  }

  // Main render with API status check
  return (
    <div>
      {apiStatus === 'error' && currentView === 'list' && (
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
      
      {currentView === 'config' && <ApiConfigView />}
      {currentView === 'list' && <TestListView />}
      {currentView === 'test' && <TestView />}
      {currentView === 'result' && <ResultView />}
    </div>
  );
};

export default MBTITestApp;