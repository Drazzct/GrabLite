"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Không thể đăng nhập. Vui lòng thử lại.");
        setIsLoading(false);
        return;
      }

      // Update AuthContext with user data
      signIn(data.user);

      // Redirect based on user type
      if (data.user.userType === "Driver") {
        router.push("/drivers/vehicles");
      } else {
        router.push("/passengers/trips");
      }
    } catch (err) {
      setError("Không thể đăng nhập. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  return (
    <div className="text-gray-800 min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link
              href="/"
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center"
            >
              <img src="/logo.svg" alt="GrabK Logo" className="w-8 h-8" />
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gra<span className="text-green-600">bK</span>
          </h1>
          <p className="text-gray-600 mt-2">Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Địa chỉ email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-8">
            Chưa có tài khoản?{" "}
            <Link
              href="/auth/signup"
              className="text-green-600 hover:text-green-700 font-bold"
            >
              Đăng ký
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <Link
            href="/"
            className="inline-flex items-center hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
