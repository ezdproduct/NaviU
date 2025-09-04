import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface MBTITestApiConfigViewProps {
  apiUrl: string;
  setApiUrl: (url: string) => void;
  setCurrentView: (view: string) => void;
}

const MBTITestApiConfigView: React.FC<MBTITestApiConfigViewProps> = ({
  apiUrl,
  setApiUrl,
  setCurrentView,
}) => {
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl);

  const handleSave = () => {
    setApiUrl(tempApiUrl);
    setCurrentView('list'); // Go back to list view after saving
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-100 flex items-center justify-center p-4">
      <Card className="rounded-xl p-8 max-w-md w-full text-center">
        <CardTitle className="text-2xl font-bold text-gray-800 mb-4">Cấu hình API</CardTitle>
        <CardDescription className="text-gray-600 mb-6">
          Vui lòng nhập URL của API WordPress để tải các bài test.
        </CardDescription>
        <div className="space-y-4 mb-6">
          <Label htmlFor="apiUrl" className="sr-only">URL API</Label>
          <Input
            id="apiUrl"
            type="url"
            placeholder="Ví dụ: https://your-wordpress-site.com/wp-json/tests/v1"
            value={tempApiUrl}
            onChange={(e) => setTempApiUrl(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Lưu & Tải lại
          </Button>
          <Button variant="outline" onClick={() => setCurrentView('list')}>
            Hủy
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MBTITestApiConfigView;