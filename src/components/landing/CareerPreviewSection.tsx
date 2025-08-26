import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Import Badge component
import { ArrowRight } from 'lucide-react';
import { careerData } from '@/data/careerData'; // Import careerData
import { cn } from '@/lib/utils'; // Import cn utility

const CareerPreviewSection = () => {
  // Lấy tất cả dữ liệu sự nghiệp để hiển thị trong bảng
  const careersToDisplay = careerData;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          La Bàn Sự Nghiệp Của Bạn
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Khám phá những ngành nghề phù hợp nhất với bạn dựa trên phân tích toàn diện về tính cách, sở thích và năng lực.
        </p>
        
        {/* Desktop View - Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border shadow-md mb-12">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên Ngành/Nghề</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Điểm Phù Hợp</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Nhu Cầu Thị Trường</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {careersToDisplay.map(job => (
                        <tr key={job.rank} className={job.highlight ? 'bg-blue-50' : ''}>
                            <td className={`px-6 py-4 whitespace-nowrap ${job.highlight ? 'font-bold' : ''}`}>{job.rank}</td>
                            <td className={`px-6 py-4 whitespace-nowrap ${job.highlight ? 'font-bold text-blue-600' : ''}`}>{job.name}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-center ${job.highlight ? 'font-bold text-blue-600' : ''}`}>{job.score}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <Badge className={cn(job.demandColor, "text-white")}>{job.demand}</Badge> {/* Updated Badge styling */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Mobile View - Cards (retained for responsiveness) */}
        <div className="md:hidden space-y-4 mb-12">
            {careersToDisplay.map(job => (
                <div key={job.rank} className={`rounded-lg border p-4 ${job.highlight ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 pr-4">{job.rank}. {job.name}</h3>
                        <span className={`font-bold text-lg ${job.highlight ? 'text-blue-600' : 'text-gray-700'}`}>{job.score}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                        <span>Nhu cầu thị trường: </span>
                        <Badge className={cn(job.demandColor, "text-white")}>{job.demand}</Badge> {/* Updated Badge styling */}
                    </div>
                </div>
            ))}
        </div>

        <Link to="/profile?initialView=report">
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            Xem báo cáo đầy đủ <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CareerPreviewSection;