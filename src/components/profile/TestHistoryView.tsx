import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { testHistoryData, TestHistoryItem } from '@/data/testHistoryData';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle } from 'lucide-react';

const TestHistoryView = () => {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc gọi API
    setTimeout(() => {
      setHistory(testHistoryData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Lịch sử làm test</h1>
        <p>Đang tải lịch sử...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Lịch sử làm test</h1>
      {history.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {history.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="bg-white rounded-lg shadow-sm border">
              <AccordionTrigger className="p-4 hover:no-underline">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-left">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">{item.testTitle}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Hoàn thành ngày: {item.dateCompleted}</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <Badge>Kết quả: {item.result}</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 border-t">
                <h4 className="font-semibold mb-3 text-gray-700">Chi tiết câu trả lời:</h4>
                <ul className="space-y-4">
                  {item.questions.map((q) => (
                    <li key={q.id} className="p-3 bg-gray-50 rounded-md border">
                      <p className="text-sm text-gray-800 mb-2">{q.text}</p>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-gray-600">Bạn đã chọn:</span>
                        <span className="font-semibold text-gray-800 ml-1">
                          ({q.userAnswer.toUpperCase()}) {q.options.find(opt => opt.key === q.userAnswer)?.text}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p>Bạn chưa hoàn thành bài test nào.</p>
      )}
    </div>
  );
};

export default TestHistoryView;