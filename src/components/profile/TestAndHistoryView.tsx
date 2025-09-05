import React from 'react';
import DoTestView from './DoTestView';
// HistoryHubView không còn được sử dụng trực tiếp ở đây nữa

const TestAndHistoryView = () => {
  return (
    <div className="p-4 sm:p-6">
      {/* Loại bỏ Tabs và chỉ hiển thị DoTestView */}
      <DoTestView />
    </div>
  );
};

export default TestAndHistoryView;