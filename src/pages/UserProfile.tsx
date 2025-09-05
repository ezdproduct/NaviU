import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { getUserProfile, updateUserProfile } from "@/lib/auth/api";
import { getToken } from "@/lib/auth/storage";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { UserProfileData } from "@/types";

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileData | null>(null); // Stores the original fetched profile data
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    first_name: "",
    last_name: "",
    email: "",
    description: "",
    phone: "",
    birthday: "",
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const token = getToken();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setMessage(null);
      if (!token) {
        setMessage({ type: 'error', text: "Bạn chưa đăng nhập." });
        setLoading(false);
        return;
      }
      try {
        const response = await getUserProfile();
        if (response.success && response.data) {
          const profileData = response.data;
          setProfile(profileData);
          setFormData({
            display_name: profileData.display_name || "",
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            email: profileData.email || "",
            description: profileData.description || "",
            phone: profileData.meta?.phone || "",
            birthday: profileData.meta?.birthday || "",
          });
        } else {
          setMessage({ type: 'error', text: response.message || "Không thể tải thông tin người dùng." });
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setMessage({ type: 'error', text: err.message || "Không thể tải thông tin người dùng." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const updatePayload = {
        display_name: formData.display_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email, // Backend PHP hiện tại không cập nhật trường này
        description: formData.description,
        phone: formData.phone,
        birthday: formData.birthday,
      };
      const response = await updateUserProfile(updatePayload);
      if (response.success) {
        setMessage({ type: 'success', text: response.message || "Cập nhật thành công!" });
        // Re-fetch profile to ensure UI is in sync with backend
        const updatedProfileResponse = await getUserProfile();
        if (updatedProfileResponse.success && updatedProfileResponse.data) {
          setProfile(updatedProfileResponse.data);
          setFormData({
            display_name: updatedProfileResponse.data.display_name || "",
            first_name: updatedProfileResponse.data.first_name || "",
            last_name: updatedProfileResponse.data.last_name || "",
            email: updatedProfileResponse.data.email || "",
            description: updatedProfileResponse.data.description || "",
            phone: updatedProfileResponse.data.meta?.phone || "",
            birthday: updatedProfileResponse.data.meta?.birthday || "",
          });
        }
        setEditing(false);
      } else {
        setMessage({ type: 'error', text: response.message || "Cập nhật thất bại!" });
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setMessage({ type: 'error', text: err.message || "Cập nhật thất bại!" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage(null);
    // Reset formData to current profile values
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        description: profile.description || "",
        phone: profile.meta?.phone || "",
        birthday: profile.meta?.birthday || "",
      });
    }
  };

  if (!token) {
    return <p className="text-center text-red-500">Bạn chưa đăng nhập.</p>;
  }

  if (loading && !profile) { // Only show full skeleton if no profile data is loaded yet
    return (
      <Card className="p-6">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-20 w-full" /></div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  if (!profile) {
    return <p className="text-center text-gray-600">Không có dữ liệu hồ sơ.</p>;
  }

  return (
    <Card className="max-w-2xl mx-auto p-6 rounded-2xl shadow">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-2xl font-bold">Thông tin cá nhân</CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân của bạn tại đây.</CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{message.type === 'success' ? 'Thành công' : 'Lỗi'}</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="display_name">Tên hiển thị</Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              value={formData.display_name}
              onChange={handleChange}
              disabled={!editing}
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
            />
            {!editing && <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi qua trang này.</p>}
          </div>
          <div>
            <Label htmlFor="first_name">Họ</Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              disabled={!editing}
              maxLength={50}
            />
          </div>
          <div>
            <Label htmlFor="last_name">Tên</Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              disabled={!editing}
              maxLength={50}
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
              maxLength={20}
            />
          </div>
          <div>
            <Label htmlFor="birthday">Ngày sinh</Label>
            <Input
              id="birthday"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Giới thiệu</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={!editing}
            rows={4}
            maxLength={500}
          />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Thông tin khác</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><strong>Tổng số bài test đã làm:</strong> {profile.meta?.total_tests_taken || 0}</p>
            <p><strong>Điểm trung bình:</strong> {profile.meta?.average_score?.toFixed(2) || 'N/A'}</p>
            <p><strong>Ngày đăng ký:</strong> {profile.meta?.registration_date ? new Date(profile.meta.registration_date).toLocaleDateString('vi-VN') : 'N/A'}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-0 mt-6 flex space-x-2">
        {editing ? (
          <>
            <Button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={loading} className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg">
              Hủy
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
            Chỉnh sửa
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserProfile;