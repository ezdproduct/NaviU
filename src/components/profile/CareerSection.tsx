import React from 'react';
import { careerData } from '@/data/careerData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import { NaviuResultData } from '@/types'; // Import NaviuResultData

interface CareerSectionProps {
  naviuResult: NaviuResultData | null;
  isLoadingResult: boolean;
}

const CareerSection = ({ naviuResult, isLoadingResult }: CareerSectionProps) => {
  const navigate = useNavigate();

  if (isLoadingResult) {
    return (
      <div className="bg-gray-50 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">La bàn Sự nghiệp</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!naviuResult) {
    return (
      <div className="bg-gray-50 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">La bàn Sự nghiệp</h2>
        <Card className="p-6 text-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50">
          <FileQuestion className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <CardTitle className="text-xl font-bold text-gray-800 mb-2">Chưa có dữ liệu sự nghiệp</CardTitle>
          <CardDescription className="text-gray-600">
            Hãy hoàn thành Bài Test Toàn Diện NaviU để khám phá la bàn sự nghiệp của bạn!
          </CardDescription>
          <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} className="mt-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
            Làm Bài Test Toàn Diện NaviU
          </Button>
        </Card>
      </div>
    );
  }

  // Render actual career data if naviuResult exists
  return (
    <div className="bg-gray-50 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 border-b pb-4 mb-6">La bàn Sự nghiệp</h2>
        <p className="text-lg text-gray-600 mb-6">Dựa trên phân tích đa chiều, đây là 5 ngành nghề phù hợp nhất với bạn.</p>
        
        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-4">
            {careerData.map(job => (
                <div key={job.rank} className={`rounded-lg border p-4 ${job.highlight ? 'bg-blue-100 border-blue-200' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 pr-4">{job.rank}. {job.name}</h3>
                        <span className={`font-bold text-lg ${job.highlight ? 'text-blue-600' : 'text-gray-700'}`}>{job.score}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                        <span>Nhu cầu thị trường: </span>
                        <Badge className={cn(job.demandColor, "text-white")}>{job.demand}</Badge>
                    </div>
                </div>
            ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên Ngành/Nghề</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Điểm Phù Hợp</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Nhu Cầu Thị Trường</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {careerData.map(job => (
                        <tr key={job.rank} className={job.highlight ? 'bg-blue-50' : ''}>
                            <td className={`px-6 py-4 whitespace-nowrap ${job.highlight ? 'font-bold' : ''}`}>{job.rank}</td>
                            <td className={`px-6 py-4 whitespace-nowrap ${job.highlight ? 'font-bold text-blue-600' : ''}`}>{job.name}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center ${job.highlight ? 'font-bold text-blue-600' : ''}`}>{job.score}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <Badge className={cn(job.demandColor, "text-white")}>{job.demand}</Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default CareerSection;