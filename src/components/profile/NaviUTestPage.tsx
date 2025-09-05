import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NaviuIntro from './naviu/NaviuIntro';

export interface NaviuResultData {
  result?: { // This seems to be the major_group_name/code
    major_group_name: string;
    major_group_code: string;
  };
  mbti?: {
    result: string;
    scores: { [key: string]: number };
    clarity: { [key: string]: string };
    percent: { [key: string]: string };
  };
  eq?: {
    scores: { [key: string]: number };
    levels: { [key: string]: string };
  };
  cognitive?: {
    Logic: number;
    Ngôn_ngữ: number; // Assuming keys might be `Ngôn_ngữ` or `Ngôn ngữ`
    Không_gian: number; // Assuming keys might be `Không_gian` or `Không gian`
  };
  holland?: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
}

export interface NaviuHistoryItem {
  id: string;
  title: string;
  submitted_at: string;
  mbti?: string; // These are summary strings for history view
  eq?: string;
  cog?: string;
  holland?: string;
  details?: NaviuResultData; // Full details for result page
}

interface NaviUTestPageProps {
  initialResultData?: NaviuResultData;
}

const NaviUTestPage = ({ initialResultData }: NaviUTestPageProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartTest = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/profile/test/naviu/do-test');
    }
  };

  const handleViewHistory = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/profile/history/naviu');
    }
  };

  return (
    <div className="p-4 sm:p-6 flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <NaviuIntro onStartTest={handleStartTest} onViewHistory={handleViewHistory} />
    </div>
  );
};

export default NaviUTestPage;