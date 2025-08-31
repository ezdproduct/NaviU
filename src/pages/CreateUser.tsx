import React, { useState } from "react";
import { API_BASE_URL } from '@/utils/constants'; // Import mới

const WP_BASE = API_BASE_URL; // Sử dụng API_BASE_URL từ constants

export default function CreateUserWithJWT() {
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const [u, setU] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  // 1) Đăng nhập admin để lấy JWT (cần quyền create_users)
  async function loginAdmin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const r = await fetch(`${WP_BASE}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: adminUser, password: adminPass }),
    });
    const j = await r.json();
    if (!r.ok || !j?.token) {
      setMsg(j?.message || "Login thất bại");
      return;
    }
    setToken(j.token);
    setMsg("Đăng nhập admin OK. Đã có JWT.");
  }

  // 2) Tạo user mới qua WP REST (cần header Authorization: Bearer <admin JWT>)
  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!token) {
      setMsg("Chưa có admin JWT. Hãy đăng nhập admin trước.");
      return;
    }
    const r = await fetch(`${WP_BASE}/wp-json/wp/v2/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: u.username,
        email: u.email,
        password: u.password,
        roles: ["subscriber"], // hoặc role khác nếu cần
      }),
    });
    const j = await r.json();
    if (!r.ok) {
      setMsg(j?.message || "Tạo user thất bại");
      return;
    }
    setMsg(`Tạo user thành công: ${j.username} (id: ${j.id})`);
    setU({ username: "", email: "", password: "" });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md mx-auto p-6 rounded-2xl shadow border bg-white space-y-6">
        <h1 className="text-xl font-bold">Create User (JWT – DEV ONLY)</h1>

        <form onSubmit={loginAdmin} className="space-y-3">
            <p className="font-semibold">1) Đăng nhập admin để lấy JWT</p>
            <input
            className="w-full border rounded p-2"
            placeholder="Admin username"
            value={adminUser}
            onChange={(e) => setAdminUser(e.target.value)}
            />
            <input
            className="w-full border rounded p-2"
            placeholder="Admin password"
            type="password"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            />
            <button className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition-colors">
            Lấy JWT
            </button>
        </form>

        <form onSubmit={createUser} className="space-y-3">
            <p className="font-semibold">2) Tạo user mới (cần JWT ở bước 1)</p>
            <input
            className="w-full border rounded p-2"
            placeholder="New username"
            value={u.username}
            onChange={(e) => setU({ ...u, username: e.target.value })}
            />
            <input
            className="w-full border rounded p-2"
            placeholder="New email"
            value={u.email}
            onChange={(e) => setU({ ...u, email: e.target.value })}
            />
            <input
            className="w-full border rounded p-2"
            placeholder="New password"
            type="password"
            value={u.password}
            onChange={(e) => setU({ ...u, password: e.target.value })}
            />
            <button className="w-full bg-emerald-600 text-white rounded py-2 hover:bg-emerald-700 transition-colors">
            Tạo user
            </button>
        </form>

        {msg && <p className="text-sm p-3 bg-gray-100 rounded">{msg}</p>}
        {token ? <p className="text-xs text-gray-500">(ĐÃ có JWT trong state)</p> : null}
        </div>
    </div>
  );
}