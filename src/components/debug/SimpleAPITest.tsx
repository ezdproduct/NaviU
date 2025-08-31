import React, { useState } from 'react';
import { WP_BASE_URL } from '../../lib/auth/api'; // Import WP_BASE_URL

const SimpleAPITest: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }]);
  };
  
  const testBasicWordPress = async () => {
    setLoading(true);
    setResults([]); // Clear previous results
    
    try {
      // Test 1: Basic WordPress API
      console.log('🧪 Testing basic WordPress API...');
      const response1 = await fetch(`${WP_BASE_URL}/wp/v2/`);
      const data1 = await response1.text(); // Get as text first
      
      addResult('Basic WP API', {
        status: response1.status,
        contentType: response1.headers.get('content-type'),
        isJSON: data1.startsWith('{') || data1.startsWith('['),
        preview: data1.substring(0, Math.min(data1.length, 200)) // Ensure substring doesn't go out of bounds
      });
      
      // Test 2: JWT endpoint exists
      console.log('🧪 Testing JWT endpoint...');
      const response2 = await fetch(`${WP_BASE_URL}/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: 'test' }) // Dummy data for endpoint check
      });
      
      const data2 = await response2.text();
      
      addResult('JWT Endpoint', {
        status: response2.status,
        contentType: response2.headers.get('content-type'),
        isJSON: data2.startsWith('{') || data2.startsWith('['),
        preview: data2.substring(0, Math.min(data2.length, 200))
      });
      
      // Test 3: Direct WordPress URL
      console.log('🧪 Testing direct WordPress...');
      const wpUrl = WP_BASE_URL.replace('/wp-json', '');
      const response3 = await fetch(wpUrl);
      const data3 = await response3.text();
      
      addResult('WordPress Site', {
        url: wpUrl,
        status: response3.status,
        contentType: response3.headers.get('content-type'),
        hasWordPress: data3.includes('wp-content') || data3.includes('WordPress')
      });
      
    } catch (error) {
      console.error('Test error:', error);
      addResult('Test Error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const clearResults = () => {
    setResults([]);
  };
  
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Chẩn đoán API WordPress</h2>
      
      <div className="flex gap-2 mb-6">
        <button 
          onClick={testBasicWordPress}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang chạy kiểm tra...' : 'Chạy tất cả kiểm tra'}
        </button>
        
        <button 
          onClick={clearResults}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          Xóa kết quả
        </button>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg text-gray-800">{result.test}</h3>
            <p className="text-sm text-gray-500 mb-2">{new Date(result.timestamp).toLocaleString('vi-VN')}</p>
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-60">
              {JSON.stringify(result.result, null, 2)}
            </pre>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
        <h3 className="font-semibold text-lg mb-2">Thông tin API hiện tại:</h3>
        <p className="font-mono text-sm break-all"><strong>Base URL:</strong> {WP_BASE_URL}</p>
        
        <h3 className="font-semibold mt-4 mb-2">Các URL dự kiến hoạt động:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li><code>{WP_BASE_URL}/wp/v2/</code></li>
          <li><code>{WP_BASE_URL}/jwt-auth/v1/token</code></li>
          <li><code>{WP_BASE_URL.replace('/wp-json', '')}</code> (Trang chủ WordPress)</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleAPITest;