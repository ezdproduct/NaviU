import React, { useState } from 'react';
import { authenticatedFetch, WP_BASE_URL } from '../../lib/auth/api'; // Import WP_BASE_URL
import { Button } from '@/components/ui/button'; // Import Button component

const QuickTest: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const testProfile = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await authenticatedFetch(`${WP_BASE_URL}/wp-json/users/v1/profile`);
      const data = await response.json();
      
      console.log('Profile test result:', data);
      setResult(data);
    } catch (error: any) {
      console.error('Profile test error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Kiểm tra API Profile nhanh</h3>
      <Button 
        onClick={testProfile} 
        disabled={loading}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? 'Đang kiểm tra...' : 'Test Profile API'}
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

export default QuickTest;