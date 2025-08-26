import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { updateUser } from '@/lib/auth/api'; // Import the placeholder API function
import { saveToken } from '@/lib/auth/storage'; // Import saveToken to update username in local storage

const ProfileInfo = () => {
  const { user, logout, login } = useAuth(); // Also get login to re-authenticate if username changes
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editableUsername, setEditableUsername] = useState(user?.username || '');
  // For email, we'll use a placeholder or derive from username if not available in context
  const [editableEmail, setEditableEmail] = useState(user?.username ? `${user.username.toLowerCase()}@example.com` : '');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
    // Reset password fields when entering edit mode
    setNewPassword('');
    setCurrentPassword('');
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError(null);
    // Revert changes
    setEditableUsername(user?.username || '');
    setEditableEmail(user?.username ? `${user.username.toLowerCase()}@example.com` : '');
    setNewPassword('');
    setCurrentPassword('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const loadingToastId = showLoading('Đang cập nhật thông tin...');

    try {
      if (!editableUsername || !editableEmail) {
        throw new Error('Tên đăng nhập và Email không được để trống.');
      }

      // Check if current password is required for email/password change
      const isEmailChanged = editableEmail !== (user?.username ? `${user.username.toLowerCase()}@example.com` : '');
      const isPasswordChanged = newPassword !== '';

      if ((isEmailChanged || isPasswordChanged) && !currentPassword) {
        throw new Error('Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi email hoặc mật khẩu.');
      }

      // Call the placeholder updateUser API
      await updateUser(
        user?.username || '', // current username
        editableUsername,
        editableEmail,
        newPassword,
        currentPassword,
        // In a real app, you'd pass the actual JWT token here: getToken()
      );

      // If username changed, we need to re-save the token with the new username
      // This is a simplification; a real backend would return a new token or confirm the change.
      if (user?.username !== editableUsername) {
        // This is a tricky part: if username changes, the old token might become invalid
        // or the user context needs to be fully refreshed.
        // For this example, we'll simulate updating the stored username.
        // In a real app, you might need to re-login or get a new token.
        const currentToken = localStorage.getItem('wp_jwt'); // Get existing token
        if (currentToken) {
          saveToken(currentToken, editableUsername); // Update username in local storage
          // Force a re-render of AuthContext to pick up new username
          // This is a workaround; ideally, AuthContext would have an `updateUser` method
          // that also updates its internal state.
          window.location.reload(); // Simplest way to refresh AuthContext for now
        }
      }

      showSuccess('Thông tin đã được cập nhật thành công!');
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi cập nhật thông tin.';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      dismissToast(loadingToastId);
      setIsLoading(false);
    }
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
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="username">Tên đăng nhập:</Label>
                {isEditing ? (
                  <Input
                    id="username"
                    type="text"
                    value={editableUsername}
                    onChange={(e) => setEditableUsername(e.target.value)}
                    className="mt-1"
                    required
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{user?.username || 'Không có'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email:</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editableEmail}
                    onChange={(e) => setEditableEmail(e.target.value)}
                    className="mt-1"
                    required
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-gray-800 text-lg">
                    {user?.username ? `${user.username.toLowerCase()}@example.com` : 'Không có'}
                  </p>
                )}
              </div>

              {isEditing && (
                <>
                  <div>
                    <Label htmlFor="new-password">Mật khẩu mới (để trống nếu không đổi):</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1"
                      placeholder="Để trống nếu không đổi mật khẩu"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="current-password">Mật khẩu hiện tại (bắt buộc khi đổi email/mật khẩu):</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1"
                      required={isEmailChanged || isPasswordChanged} // Dynamically require current password
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

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