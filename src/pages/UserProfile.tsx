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

const UserProfile = () => {
  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    description: ""
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
          email: profileData.email || "",
          description: profileData.description || ""
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await updateUserProfile({
      display_name: formData.display_name,
      email: formData.email,
      description: formData.description,
    });
    
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
          <div className="space-y-2">
            <Label htmlFor="display_name">Tên hiển thị</Label>
            <Input id="display_name" name="display_name" value={formData.display_name} onChange={handleChange} maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Giới thiệu</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} maxLength={500} />
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