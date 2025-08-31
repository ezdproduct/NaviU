import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '@/lib/auth/api'; // Corrected import path
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { User } from '@/types/auth'; // Import User type

const ProfileInfo: React.FC = () => {
  const { user, logout, updateUser, refreshUser } = useAuth(); // Use updateUser from context
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Start loading
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Initialize with empty strings to avoid undefined → defined transition
  const [formData, setFormData] = useState<Partial<User>>({ // Use Partial<User>
    display_name: '',
    first_name: '',
    last_name: '',
    email: '',
    meta: {
      phone: '',
      birthday: '',
    },
    description: ''
  });
  
  useEffect(() => {
    loadProfile();
  }, [user?.id]); // Reload profile if user ID changes
  
  const loadProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const fetchedUser = await getUserProfile(); // Use new getUserProfile
      
      if (fetchedUser) {
        setFormData({
          display_name: fetchedUser.display_name || '',
          first_name: fetchedUser.first_name || '',
          last_name: fetchedUser.last_name || '',
          email: fetchedUser.email || '',
          meta: {
            phone: fetchedUser.meta?.phone || '',
            birthday: fetchedUser.meta?.birthday || '',
          },
          description: fetchedUser.description || ''
        });
        // Also update AuthContext user if needed, though this component primarily uses its own state
        // updateUserInfo({ ...user, ...result.data, nickname: result.data.display_name }); // Example if you want to sync
      } else {
        setError('Failed to load profile');
      }
    } catch (error: any) {
      console.error('Profile load error:', error);
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'birthday') {
      setFormData(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [name]: value || ''
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value || '' // Ensure never undefined
      }));
    }
  };
  
  const handleBackToProfile = () => {
    navigate('/profile');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    loadProfile(); // Reload original data
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const loadingToastId = showLoading('Đang cập nhật thông tin...');
    
    try {
      const updatePayload: Partial<User> = {
        display_name: formData.display_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        // email: formData.email, // Email might not be updatable via this custom endpoint
        description: formData.description,
        meta: {
          phone: formData.meta?.phone,
          birthday: formData.meta?.birthday,
        }
      };

      const success = await updateUser(updatePayload); // Use updateUser from context
      
      if (success) {
        showSuccess('Thông tin đã được cập nhật thành công!');
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        await refreshUser(); // Refresh user data in context after update
      } else {
        showError('Đã xảy ra lỗi khi cập nhật thông tin.');
        setError('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      showError(error.message || 'Đã xảy ra lỗi khi cập nhật thông tin.');
      setError(error.message || 'Failed to update profile');
    } finally {
      dismissToast(loadingToastId);
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-700">Đang tải hồ sơ...</span>
        </div>
      </div>
    );
  }
  
  const displayName = formData.display_name || user?.username || 'Người dùng';

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
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold text-gray-800">
              {displayName}
            </CardTitle>
            <p className="text-gray-600 mt-1">{formData.description || 'Thông tin cá nhân của bạn'}</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Họ:</Label>
                  {isEditing ? (
                    <Input id="first_name" name="first_name" type="text" value={formData.first_name} onChange={handleChange} className="mt-1" disabled={saving} />
                  ) : (
                    <p className="text-gray-800 text-lg">{formData.first_name || 'Chưa có'}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Tên:</Label>
                  {isEditing ? (
                    <Input id="last_name" name="last_name" type="text" value={formData.last_name} onChange={handleChange} className="mt-1" disabled={saving} />
                  ) : (
                    <p className="text-gray-800 text-lg">{formData.last_name || 'Chưa có'}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="display_name">Tên hiển thị:</Label>
                {isEditing ? (
                  <Input id="display_name" name="display_name" type="text" value={formData.display_name} onChange={handleChange} className="mt-1" disabled={saving} />
                ) : (
                  <p className="text-gray-800 text-lg">{formData.display_name || 'Chưa có'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Mô tả bản thân:</Label>
                {isEditing ? (
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1" disabled={saving} />
                ) : (
                  <p className="text-gray-800 text-lg whitespace-pre-wrap">{formData.description || 'Chưa có'}</p>
                )}
              </div>
              <hr className="my-4" />
              <div>
                <Label htmlFor="email">Email:</Label>
                {isEditing ? (
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1" required disabled={saving} />
                ) : (
                  <p className="text-gray-800 text-lg">{formData.email || 'Không có'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Điện thoại:</Label>
                {isEditing ? (
                  <Input id="phone" name="phone" type="tel" value={formData.meta?.phone} onChange={handleChange} className="mt-1" disabled={saving} />
                ) : (
                  <p className="text-gray-800 text-lg">{formData.meta?.phone || 'Chưa có'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="birthday">Ngày sinh:</Label>
                {isEditing ? (
                  <Input id="birthday" name="birthday" type="date" value={formData.meta?.birthday} onChange={handleChange} className="mt-1" disabled={saving} />
                ) : (
                  <p className="text-gray-800 text-lg">{formData.meta?.birthday || 'Chưa có'}</p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-500">{success}</p>}

              <div className="pt-4 flex gap-2">
                {isEditing ? (
                  <>
                    <Button type="submit" className="flex-1" disabled={saving}>
                      {saving ? 'Đang lưu...' : <><Save className="h-4 w-4 mr-2" /> Lưu thay đổi</>}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelClick} disabled={saving}>
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