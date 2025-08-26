import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react'; // Chỉ giữ lại icon Download
import AiChatbox from './AiChatbox';

const ReportView = () => {
  const pdfPath = "/Báo cáo NaviU.pdf"; // Đường dẫn đến file PDF đã tải lên

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 text-xl">Bản xem trước Báo cáo</h3>
          <a href={pdfPath} target="_blank" rel="noopener noreferrer">
            <Button variant="default" className="bg-green-500 hover:bg-green-600">
              <Download className="h-5 w-5 mr-2" />
              Tải xuống
            </Button>
          </a>
        </div>
        <div className="flex flex-col flex-grow bg-white rounded-lg p-4 min-h-[600px]">
          <div className="flex-grow flex items-center justify-center overflow-auto no-scrollbar">
            {/* Iframe để nhúng PDF, đã thêm các tham số để ẩn thanh công cụ */}
            <iframe 
              src={`${pdfPath}#toolbar=0&navpanes=0`} 
              title="Báo cáo NaviU" 
              className="w-full h-full rounded-md"
              style={{ border: 'none' }}
            >
              <p>Trình duyệt của bạn không hỗ trợ xem trước PDF. Vui lòng tải xuống báo cáo.</p>
            </iframe>
          </div>
          {/* Đã loại bỏ các nút điều hướng không chức năng */}
        </div>
      </div>
      <div>
        <AiChatbox />
      </div>
    </div>
  );
};

export default ReportView;