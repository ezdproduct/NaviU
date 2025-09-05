import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DoTestView from './DoTestView';
import HistoryHubView from './HistoryHubView';

const TestAndHistoryView = () => {
  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="do-test" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="do-test">Làm Bài Test</TabsTrigger>
          <TabsTrigger value="history-report">Lịch sử & Báo cáo</TabsTrigger>
        </TabsList>
        <TabsContent value="do-test">
          <DoTestView />
        </TabsContent>
        <TabsContent value="history-report">
          <HistoryHubView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestAndHistoryView;