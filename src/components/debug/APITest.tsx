import React, { useState } from 'react';
import { testConnection } from '../../lib/auth/api';
import { Button } from '@/components/ui/button'; // Import Button component

const APITest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const handleTest = async () => {
    setLoading(true);
    try {
      const result = await testConnection();
      setResult(result);
      console.log('Test result:', result);
    } catch (error: any) { // Thêm type any cho error
      setResult({ success: false, error: error.message });
      console.error('Test error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Kiểm tra kết nối API</h3>
      <Button 
        onClick={handleTest}
        disabled={loading}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? 'Đang kiểm tra...' : 'Kiểm tra kết nối API'}
      </Button>
      
      {result && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Kết quả:</h4>
          <pre className="mt-2 p-4 bg-white rounded-md border overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default APITest;