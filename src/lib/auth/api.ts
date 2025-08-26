export async function login(username: string, password: string) {
  const res = await fetch("https://naviu-backend.ezd.vn/wp-json/jwt-auth/v1/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); 
}

export async function register(username: string, email: string, password: string) {
  // Gọi đến API endpoint tùy chỉnh mới
  const res = await fetch("https://naviu-backend.ezd.vn/wp-json/custom/v1/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    // Sử dụng thông báo lỗi từ API tùy chỉnh
    throw new Error(errorData.message || "Đăng ký không thành công.");
  }
  return res.json();
}