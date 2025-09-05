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
      <div className="bg-profile-gradient rounded-2xl shadow-lg p-6 sm:p-8 text-white"> {/* Changed bg-gray-50 to bg-profile-gradient and added text-white */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white border-b pb-4 mb-6">La bàn Sự nghiệp</h2> {/* Changed text-gray-800 to text-white */}
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-700 rounded w-1/3"></div> {/* Adjusted skeleton color */}
          <div className="h-4 bg-blue-700 rounded w-full"></div> {/* Adjusted skeleton color */}
          <div className="h-4 bg-blue-700 rounded w-full"></div> {/* Adjusted skeleton color */}
          <div className="h-4 bg-blue-700 rounded w-2/3"></div> {/* Adjusted skeleton color */}
        </div>
      </div>
    );
  }

  if (!naviuResult) {
    return (
      <div className="bg-profile-gradient rounded-2xl shadow-lg p-6 sm:p-8 text-white"> {/* Changed bg-gray-50 to bg-profile-gradient and added text-white */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white border-b pb-4 mb-6">La bàn Sự nghiệp</h2> {/* Changed text-gray-800 to text-white */}
        <Card className="p-6 text-center rounded-xl border-2 border-dashed border-blue-600 bg-blue-800 text-white"> {/* Changed bg-blue-50 border-blue-300 to bg-blue-800 border-blue-600 and added text-white */}
          <FileQuestion className="h-16 w-16 text-blue-200 mx-auto mb-4" /> {/* Changed text-blue-400 to text-blue-200 */}
          <CardTitle className="text-xl font-bold text-white mb-2">Chưa có dữ liệu sự nghiệp</CardTitle> {/* Changed text-gray-800 to text-white */}
          <CardDescription className="text-blue-100">
            Hãy hoàn thành Bài Test Toàn Diện NaviU để khám phá la bàn sự nghiệp của bạn!
          </CardDescription>
          <Button onClick={() => navigate('/profile/test/naviu-mbti/do-test')} className="mt-4 bg-blue-900 text-white hover:bg-blue-700 rounded-lg">
            Làm Bài Test Toàn Diện NaviU
          </Button>
        </Card>
      </div>
    );
  }

  // Render actual career data if naviuResult exists
  return (
    <div className="bg-profile-gradient rounded-2xl shadow-lg p-6 sm:p-8 text-white"> {/* Changed bg-gray-50 to bg-profile-gradient and added text-white */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white border-b pb-4 mb-6">La bàn Sự nghiệp</h2> {/* Changed text-gray-800 to text-white */}
        <p className="text-lg text-blue-100 mb-6">Dựa trên phân tích đa chiều, đây là 5 ngành nghề phù hợp nhất với bạn.</p> {/* Changed text-gray-600 to text-blue-100 */}
        
        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-4">
            {careerData.map(job => (
                <div key={job.rank} className={cn(
                  "rounded-lg border p-4",
                  job.highlight ? 'bg-blue-800 border-blue-700 text-white' : 'bg-blue-700 text-white' // Adjusted colors
                )}>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white pr-4">{job.rank}. {job.name}</h3> {/* Changed text-gray-800 to text-white */}
                        <span className={cn("font-bold text-lg", job.highlight ? 'text-blue-300' : 'text-blue-100')}>{job.score}</span> {/* Adjusted text colors */}
                    </div>
                    <div className="mt-2 text-sm text-blue-100"> {/* Changed text-gray-600 to text-blue-100 */}
                        <span>Nhu cầu thị trường: </span>
                        <Badge className={cn(job.demandColor === 'bg-green-600' ? 'bg-green-500' : job.demandColor === 'bg-yellow-600' ? 'bg-yellow-400' : job.demandColor, "text-white")}>{job.demand}</Badge> {/* Adjusted badge colors */}
                    </div>
                </div>
            ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-blue-700"> {/* Added border-blue-700 */}
            <table className="min-w-full divide-y divide-blue-700"> {/* Adjusted divider color */}
                <thead className="bg-blue-900"> {/* Changed bg-gray-100 to bg-blue-900 */}
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-blue-100 uppercase tracking-wider">#</th> {/* Adjusted text color */}
                        <th className="px-6 py-3 text-left text-xs font-bold text-blue-100 uppercase tracking-wider">Tên Ngành/Nghề</th> {/* Adjusted text color */}
                        <th className="px-6 py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">Điểm Phù Hợp</th> {/* Adjusted text color */}
                        <th className="px-6 py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">Nhu Cầu Thị Trường</th> {/* Adjusted text color */}
                    </tr>
                </thead>
                <tbody className="bg-blue-800 divide-y divide-blue-700"> {/* Changed bg-white to bg-blue-800 and adjusted divider color */}
                    {careerData.map(job => (
                        <tr key={job.rank} className={job.highlight ? 'bg-blue-700' : ''}> {/* Changed bg-blue-50 to bg-blue-700 */}
                            <td className={cn("px-6 py-4 whitespace-nowrap", job.highlight ? 'font-bold text-white' : 'text-blue-100')}>{job.rank}</td> {/* Adjusted text color */}
                            <td className={cn("px-6 py-4 whitespace-nowrap", job.highlight ? 'font-bold text-blue-300' : 'text-white')}>{job.name}</td> {/* Adjusted text color */}
                            <td className={cn("px-6 py-4 whitespace-nowrap text-center", job.highlight ? 'font-bold text-blue-300' : 'text-blue-100')}>{job.score}</td> {/* Adjusted text color */}
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <Badge className={cn(job.demandColor === 'bg-green-600' ? 'bg-green-500' : job.demandColor === 'bg-yellow-600' ? 'bg-yellow-400' : job.demandColor, "text-white")}>{job.demand}</Badge> {/* Adjusted badge colors */}
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