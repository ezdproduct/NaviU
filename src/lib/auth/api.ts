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

// Placeholder function for updating user information
// You will need to implement the actual backend API endpoint for this.
// This function assumes your backend has an endpoint like /wp-json/custom/v1/update-user
// that accepts username, email, newPassword, and currentPassword, and is protected by JWT.
export async function updateUser(
  currentUsername: string,
  newUsername: string,
  newEmail: string,
  newPassword?: string, // Optional, if user only wants to change username/email
  currentPassword?: string, // Required for security when changing password/email
  token?: string // JWT token for authentication
) {
  // --- BACKEND IMPLEMENTATION REQUIRED ---
  // This is a placeholder. You need to create a custom WordPress REST API endpoint
  // that handles user updates.
  // Example backend logic (pseudo-code):
  // 1. Verify the JWT token.
  // 2. Get the user ID from the token.
  // 3. Verify currentPassword if newPassword or newEmail is provided.
  // 4. Update user_login (username), user_email, and user_pass in WordPress.
  // 5. Return success or error message.
  // ---------------------------------------

  console.log("Attempting to update user (frontend simulation):", {
    currentUsername,
    newUsername,
    newEmail,
    newPassword: newPassword ? '******' : 'N/A',
    currentPassword: currentPassword ? '******' : 'N/A',
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API call success or failure
      if (newUsername === "testuser" && newEmail === "test@example.com") { // Example of a simulated failure
        reject(new Error("Tên đăng nhập hoặc email đã tồn tại."));
      } else if (!currentPassword && (newPassword || newEmail !== `${currentUsername.toLowerCase()}@example.com`)) {
        reject(new Error("Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi email hoặc mật khẩu."));
      }
      else {
        resolve({ message: "Cập nhật thông tin thành công!" });
      }
    }, 1500); // Simulate network delay
  });
}