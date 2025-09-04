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

const UserProfile = () => {
  const [formData, setFormData] = useState({
    display_name: "",
    first_name: "",
    last_name: "",
    phone: "",
    birthday: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const token = getToken();

  useEffect(() => {
    const fetchProfile = async () => {
      setPageLoading(true);
      const response = await getUserProfile();
      if (response.success && response.data) {
        const profileData = response.data;
        setFormData({
          display_name: profileData.display_name || "",
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          phone: profileData.meta?.phone || "",
          birthday: profileData.meta?.birthday || "",
        });
      } else {
        setMessage({ type: 'error', text: response.message || "Không thể tải thông tin người dùng." });
      }
      setPageLoading(false);
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await updateUserProfile(formData);
    if (response.success) {
      setMessage({ type: 'success', text: response.message || "Cập nhật thành công!" });
    } else {
      setMessage({ type: 'error', text: response.message || "Cập nhật thất bại." });
    }
    setLoading(false);
  };

  if (!token) {
    return <p className="text-center text-red-500">Bạn chưa đăng nhập.</p>;
  }

  if (pageLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          </div>
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân của bạn tại đây.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <Terminal className="h-4 w-4" />
              <AlertTitle>{message.type === 'success' ? 'Thành công' : 'Lỗi'}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last_name">Họ</Label>
              <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} maxLength={50} /> {/* Thêm maxLength */}
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name">Tên</Label>
              <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} maxLength={50} /> {/* Thêm maxLength */}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="display_name">Tên hiển thị</Label>
            <Input id="display_name" name="display_name" value={formData.display_name} onChange={handleChange} maxLength={100} /> {/* Thêm maxLength */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10,15}" // Ví dụ: 10-15 chữ số
                title="Số điện thoại phải có từ 10 đến 15 chữ số."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Ngày sinh</Label>
              <Input id="birthday" name="birthday" type="date" value={formData.birthday} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserProfile;