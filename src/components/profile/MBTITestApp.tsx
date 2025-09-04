import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

// Import modularized views
import MBTITestListView from './mbti/MBTITestListView';
import MBTITestTakingView from './mbti/MBTITestTakingView';
import MBTITestResultView from './mbti/MBTITestResultView';
import MBTITestApiConfigView from './mbti/MBTITestApiConfigView';

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
      {currentView === 'config' && (
        <MBTITestApiConfigView
          apiUrl={apiUrl}
          setApiUrl={setApiUrl}
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === 'list' && (
        <MBTITestListView
          tests={tests}
          loading={loading}
          error={error}
          startTest={startTest}
          setCurrentView={setCurrentView}
          apiStatus={apiStatus}
        />
      )}
      {currentView === 'test' && (
        <MBTITestTakingView
          currentTest={currentTest}
          currentQuestion={currentQuestion}
          answers={answers}
          loading={loading}
          handleAnswer={handleAnswer}
          nextQuestion={nextQuestion}
          prevQuestion={prevQuestion}
          submitTest={submitTest}
        />
      )}
      {currentView === 'result' && (
        <MBTITestResultView
          result={result}
          resetTest={resetTest}
        />
      )}
    </div>
  );
};

export default MBTITestApp;