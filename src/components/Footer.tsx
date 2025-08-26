import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <img src="/naviU.png" alt="NaviU Logo" className="h-8 mx-auto mb-4" />
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} NaviU. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Kiến tạo tương lai, bắt đầu từ thấu hiểu bản thân.
        </p>
      </div>
    </footer>
  );
};

export default Footer;