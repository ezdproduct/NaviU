import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import UsersAPI from '@/api/users'; // Import mới

const ProfileInfo = () => {
  const { user, logout, updateUserInfo } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    description: '',
    nickname: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        description: user.description || '',
        nickname: user.nickname || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError(null);
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        description: user.description || '',
        nickname: user.nickname || '',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const loadingToastId = showLoading('Đang cập nhật thông tin...');

    try {
      if (!user?.id) {
        throw new Error('Không tìm thấy ID người dùng để cập nhật.');
      }
      if (!formData.username || !formData.email) {
        throw new Error('Tên đăng nhập và Email không được để trống.');
      }

      const updatePayload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        description: formData.description,
        nickname: formData.nickname,
      };

      const result = await UsersAPI.updateProfile(user.id, updatePayload);

      if (result.success) {
        updateUserInfo(result.data); // Cập nhật thông tin người dùng trong AuthContext
        showSuccess('Thông tin đã được cập nhật thành công!');
        setIsEditing(false);
      } else {
        throw new Error(result.message || 'Cập nhật thông tin thất bại.');
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi cập nhật thông tin.';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      dismissToast(loadingToastId);
      setIsLoading(false);
    }
  };

  const displayName = user?.first_name || user?.last_name ? `${user.first_name} ${user.last_name}`.trim() : user?.username;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={handleBackToProfile} className="mb-6 text-blue-600 hover:bg-blue-50">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại Hồ sơ
        </Button>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="flex flex-col items-center text-center p-6 border-b">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarFallback className="text-4xl font-bold bg-blue-600 text-white">
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold text-gray-800">
              {displayName || 'Người dùng'}
            </CardTitle>
            <p className="text-gray-600 mt-1">{user?.description || 'Thông tin cá nhân của bạn'}</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Họ:</Label>
                  {isEditing ? (
                    <Input id="first_name" type="text" value={formData.first_name} onChange={handleInputChange} className="mt-1" disabled={isLoading} />
                  ) : (
                    <p className="text-gray-800 text-lg">{user?.first_name || 'Chưa có'}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Tên:</Label>
                  {isEditing ? (
                        <Input id="last_name" type="text" value={formData.last_name} onChange={handleInputChange} className="mt-1" disabled={isLoading} />
                  ) : (
                    <p className="text-gray-800 text-lg">{user?.last_name || 'Chưa có'}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="nickname">Biệt danh:</Label>
                {isEditing ? (
                  <Input id="nickname" type="text" value={formData.nickname} onChange={handleInputChange} className="mt-1" disabled={isLoading} />
                ) : (
                  <p className="text-gray-800 text-lg">{user?.nickname || 'Chưa có'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Mô tả bản thân:</Label>
                {isEditing ? (
                  <Textarea id="description" value={formData.description} onChange={handleInputChange} className="mt-1" disabled={isLoading} />
                ) : (
                  <p className="text-gray-800 text-lg whitespace-pre-wrap">{user?.description || 'Chưa có'}</p>
                )}
              </div>
              <hr className="my-4" />
              <div>
                <Label htmlFor="username">Tên đăng nhập:</Label>
                {isEditing ? (
                  <Input id="username" type="text" value={formData.username} onChange={handleInputChange} className="mt-1" required disabled={isLoading} />
                ) : (
                  <p className="text-gray-800 text-lg">{user?.username || 'Không có'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email:</Label>
                {isEditing ? (
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="mt-1" required disabled={isLoading} />
                ) : (
                  <p className="text-gray-800 text-lg">{user?.email || 'Không có'}</p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="pt-4 flex gap-2">
                {isEditing ? (
                  <>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? 'Đang lưu...' : <><Save className="h-4 w-4 mr-2" /> Lưu thay đổi</>}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelClick} disabled={isLoading}>
                      <X className="h-4 w-4 mr-2" /> Hủy
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={handleEditClick} className="w-full">
                    <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa hồ sơ
                  </Button>
                )}
              </div>
            </form>
            {!isEditing && (
              <div className="pt-4">
                <Button onClick={logout} variant="destructive" className="w-full">
                  Đăng xuất
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileInfo;