import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
    name: "", // Maps to display_name
    email: "",
    phone: "", // Maps to meta.phone
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
            name: profileData.display_name || "",
            email: profileData.email || "",
            phone: profileData.meta?.phone || "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const updatePayload = {
        display_name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      const response = await updateUserProfile(updatePayload);
      if (response.success) {
        setMessage({ type: 'success', text: response.message || "Cập nhật thành công!" });
        // Re-fetch profile to ensure UI is in sync with backend
        const updatedProfileResponse = await getUserProfile();
        if (updatedProfileResponse.success && updatedProfileResponse.data) {
          setProfile(updatedProfileResponse.data);
          setFormData({
            name: updatedProfileResponse.data.display_name || "",
            email: updatedProfileResponse.data.email || "",
            phone: updatedProfileResponse.data.meta?.phone || "",
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
        name: profile.display_name || "",
        email: profile.email || "",
        phone: profile.meta?.phone || "",
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
    <Card className="max-w-md mx-auto p-6 rounded-2xl shadow">
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

        <div>
          <Label htmlFor="name">Tên hiển thị</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
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
      </CardContent>

      <CardFooter className="p-0 mt-6 flex space-x-2">
        {editing ? (
          <>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Hủy
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)} disabled={loading}>
            Chỉnh sửa
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserProfile;