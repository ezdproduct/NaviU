import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfileInfo = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={handleBackToProfile} className="mb-6 text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại Hồ sơ
        </Button>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="flex flex-col items-center text-center p-6 border-b">
            <Avatar className="w-24 h-24 mb-4">
              {/* Trong thực tế, bạn có thể lấy ảnh đại diện từ user.avatar */}
              <AvatarFallback className="text-4xl font-bold bg-blue-600 text-white">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold text-gray-800">
              {user?.username || 'Người dùng'}
            </CardTitle>
            <p className="text-gray-600 mt-1">Thông tin cá nhân của bạn</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Tên đăng nhập:</h4>
              <p className="text-gray-800 text-lg">{user?.username || 'Không có'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Email:</h4>
              <p className="text-gray-800 text-lg">
                {/* Trong thực tế, bạn cần lưu email vào AuthContext hoặc fetch từ API */}
                {user?.username ? `${user.username.toLowerCase()}@example.com` : 'Không có'}
              </p>
            </div>
            <div className="pt-4">
              <Button onClick={logout} variant="destructive" className="w-full">
                Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileInfo;