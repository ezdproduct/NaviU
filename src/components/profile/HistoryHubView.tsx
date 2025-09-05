import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, ArrowRight } from 'lucide-react';

const HistoryHubView = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Lịch sử & Báo cáo</h1>
      <p className="text-gray-600 mb-8">Xem lại kết quả và lịch sử làm bài của các bài test bạn đã hoàn thành.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="text-blue-600" />
              Bài Test NaviU
            </CardTitle>
            <CardDescription>Xem lại tất cả các kết quả bài test NaviU toàn diện của bạn.</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto pt-4">
            <Button asChild>
              <Link to="/profile/history/naviu">
                Xem lịch sử NaviU <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="text-purple-600" />
              Bài Test ĐGTC
            </CardTitle>
            <CardDescription>Xem lại tất cả các kết quả bài test tính cách ĐGTC của bạn.</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto pt-4">
            <Button asChild>
              <Link to="/profile/history/dgtc">
                Xem lịch sử ĐGTC <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default HistoryHubView;