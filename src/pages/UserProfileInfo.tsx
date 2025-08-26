import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_VIEWER_PROFILE } from '@/graphql/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const UserProfileInfo = () => {
  const { loading, error, data } = useQuery(GET_VIEWER_PROFILE);

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-col items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            Không thể tải thông tin profile: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const user = data?.viewer;

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-3xl">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Không tìm thấy</AlertTitle>
          <AlertDescription>
            Không tìm thấy thông tin người dùng. Vui lòng đảm bảo bạn đã đăng nhập.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.avatar?.url || `https://ui-avatars.com/api/?name=${displayName}&background=random&color=fff&size=128`} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-gray-800">{displayName}</CardTitle>
          <p className="text-lg text-gray-600">{user.email}</p>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-lg mb-1">Tên đăng nhập:</h4>
            <p>{user.username}</p>
          </div>
          {user.firstName && (
            <div>
              <h4 className="font-semibold text-lg mb-1">Tên:</h4>
              <p>{user.firstName}</p>
            </div>
          )}
          {user.lastName && (
            <div>
              <h4 className="font-semibold text-lg mb-1">Họ:</h4>
              <p>{user.lastName}</p>
            </div>
          )}
          {user.description && (
            <div>
              <h4 className="font-semibold text-lg mb-1">Giới thiệu:</h4>
              <p>{user.description}</p>
            </div>
          )}
          {/* Thêm các thông tin khác nếu có */}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileInfo;