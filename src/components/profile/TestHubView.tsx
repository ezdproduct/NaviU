import React, { useState, useEffect, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { testHubData } from '@/data/testHubData';
import TestCard from './TestCard';
import ConfirmSampleReportDownloadModal from '@/components/ConfirmSampleReportDownloadModal';
import { useAuth } from '@/contexts/AuthContext';
import { WP_BASE_URL } from '@/lib/auth/api';
import { showError, showSuccess } from '@/utils/toast';

const API_URL_DGTC = `${WP_BASE_URL}/wp-json/mbti/v1`;

const TestSection = ({ title, tests, naviuResult, hasDGTCResult, onShowSampleReportConfirm }: {
  title: string;
  tests: any[];
  naviuResult: any;
  hasDGTCResult: boolean;
  onShowSampleReportConfirm: (testTitle: string, testType: string) => void;
}) => (
  <section>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent className="-ml-4">
        {tests.map((test, index) => {
          let hasResult = false;
          if (test.testType === 'dgtc') {
            hasResult = hasDGTCResult;
          } else if (test.testType === 'naviu-mbti') {
            hasResult = !!naviuResult;
          }
          // For other mock tests, assume no result for now
          
          return (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <TestCard
                  test={{ ...test, link: `/profile/test/${test.testType}/do-test` }}
                  hasResult={hasResult}
                  onShowSampleReportConfirm={onShowSampleReportConfirm}
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  </section>
);

const TestHubView = () => {
  const { naviuResult, user } = useAuth();
  const token = user ? localStorage.getItem('jwt_token') : null;

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedTestTitle, setSelectedTestTitle] = useState('');
  const [selectedTestType, setSelectedTestType] = useState('');
  const [hasDGTCResult, setHasDGTCResult] = useState(false);

  const fetchDGTCResultStatus = useCallback(async () => {
    if (!token) {
      setHasDGTCResult(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL_DGTC}/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHasDGTCResult(data && data.length > 0);
      } else {
        setHasDGTCResult(false);
      }
    } catch (error) {
      console.error("Error fetching DGTC history status:", error);
      setHasDGTCResult(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDGTCResultStatus();
  }, [fetchDGTCResultStatus]);

  const handleShowSampleReportConfirm = (testTitle: string, testType: string) => {
    setSelectedTestTitle(testTitle);
    setSelectedTestType(testType);
    setShowDownloadModal(true);
  };

  const handleConfirmDownloadSample = () => {
    setShowDownloadModal(false);
    // Logic to download the sample PDF
    const samplePdfPath = '/Báo cáo NaviU.pdf'; // Path to your sample PDF in the public folder
    const link = document.createElement('a');
    link.href = samplePdfPath;
    link.download = `BaoCaoMau_${selectedTestType}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(`Đang tải báo cáo mẫu cho "${selectedTestTitle}"...`);
  };

  return (
    <div className="space-y-12">
      <TestSection
        title="Hiểu Mình"
        tests={testHubData.hieuMinh}
        naviuResult={naviuResult}
        hasDGTCResult={hasDGTCResult}
        onShowSampleReportConfirm={handleShowSampleReportConfirm}
      />
      <TestSection
        title="Hiểu Trường"
        tests={testHubData.hieuTruong}
        naviuResult={naviuResult} // Pass naviuResult even if not directly used by these mock tests
        hasDGTCResult={hasDGTCResult}
        onShowSampleReportConfirm={handleShowSampleReportConfirm}
      />
      <TestSection
        title="Hiểu Ngành"
        tests={testHubData.hieuNganh}
        naviuResult={naviuResult} // Pass naviuResult even if not directly used by these mock tests
        hasDGTCResult={hasDGTCResult}
        onShowSampleReportConfirm={handleShowSampleReportConfirm}
      />

      <ConfirmSampleReportDownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onConfirm={handleConfirmDownloadSample}
        testTitle={selectedTestTitle}
      />
    </div>
  );
};

export default TestHubView;