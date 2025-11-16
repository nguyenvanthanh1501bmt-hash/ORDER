"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import client from "@/api/client";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Đăng nhập KHÔNG redirect
      const { data: loginData, error: loginError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (loginError) {
        setError(loginError.message || "Login failed");
        setLoading(false);
        return;
      }

      // 2. Lấy role từ bảng staff
      const { data: staffData, error: staffError } = await client
        .from("staff")
        .select("role")
        .ilike("email", email.trim()) // không phân biệt hoa thường
        .single();

      if (staffError || !staffData) {
        setError("Staff record not found");
        setLoading(false);
        return;
      }

      const role = staffData.role?.toLowerCase();

      // 3. Router push theo role
      if (role === "admin") {
        router.push("/Admin");

        console.log(role)
      } else if (role === "staff") {
        router.push("/staff");
      } else {
        setError("Unknown role");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10 p-4 border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-center">Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
