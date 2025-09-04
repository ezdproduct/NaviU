import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getUserProfile, updateUserProfile } from "@/lib/auth/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MbtiProfile from "@/components/profile/MbtiProfile"; // Import component mới

const PersonalInfo = () => {
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
    fetchProfile();
  }, []);

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

  if (pageLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
        </div>
        <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
          <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
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
            <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="first_name">Tên</Label>
            <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="display_name">Tên hiển thị</Label>
          <Input id="display_name" name="display_name" value={formData.display_name} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
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
  );
};

const UserProfile = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cài đặt Tài khoản</CardTitle>
        <CardDescription>Quản lý thông tin cá nhân và các cài đặt khác của bạn.</CardDescription>
      </CardHeader>
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="mbti">Hồ sơ MBTI</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <PersonalInfo />
        </TabsContent>
        <TabsContent value="mbti">
          <CardContent>
            <MbtiProfile />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default UserProfile;