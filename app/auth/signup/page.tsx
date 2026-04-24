"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Car } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [userType, setUserType] = useState<"passenger" | "driver">("passenger");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    driverLicenseGrade: "B2",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không trùng khớp.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("Bạn phải đồng ý với điều khoản và điều kiện.");
      return;
    }

    if (!formData.phone.match(/^0\d{9}$/)) {
      setError(
        "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại đúng định dạng (0XXXXXXXXX).",
      );
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const payload: any = {
        name: fullName,
        phoneNumber: formData.phone,
        email: formData.email,
        password: formData.password,
        gender: "Male",
        userType: userType === "driver" ? "Driver" : "Passenger",
      };

      if (userType === "driver") {
        payload.driverLicenseGrade = formData.driverLicenseGrade;
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Không thể tạo tài khoản. Vui lòng thử lại.");
        setIsLoading(false);
        return;
      }

      // Update AuthContext with user data
      signIn(data.user);

      // Redirect based on user type
      if (userType === "driver") {
        router.push("/drivers/vehicles");
      } else {
        router.push("/passengers/trips");
      }
    } catch (err) {
      setError("Không thể tạo tài khoản. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  return (
    <div className="text-gray-800 min-h-screen bg-linear-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link
              href="/"
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center"
            >
              <img src="/logo.svg" alt="GrabLite Logo" className="w-8 h-8" />
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GrabLite</h1>
          <p className="text-gray-600 mt-2">Tạo tài khoản của bạn</p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tôi muốn:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setUserType("passenger")}
              className={`p-4 rounded-lg border-2 transition flex flex-col items-center text-center ${
                userType === "passenger"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Car
                className={`w-8 h-8 mb-2 ${
                  userType === "passenger" ? "text-green-600" : "text-gray-700"
                }`}
              />
              <div className="font-bold text-gray-900">Đặt chuyến đi</div>
              <div className="text-sm text-gray-600">Tôi là hành khách</div>
            </button>

            <button
              onClick={() => setUserType("driver")}
              className={`p-4 rounded-lg border-2 transition flex flex-col items-center text-center ${
                userType === "driver"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Briefcase
                className={`w-8 h-8 mb-2 ${
                  userType === "driver" ? "text-green-600" : "text-gray-700"
                }`}
              />
              <div className="font-bold text-gray-900">Kiếm tiền</div>
              <div className="text-sm text-gray-600">Tôi là tài xế</div>
            </button>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Nguyễn"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Họ
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Văn A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Phone Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="0912345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Driver License Grade - Only for Drivers */}
            {userType === "driver" && (
              <div>
                <label
                  htmlFor="driverLicenseGrade"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hạng giấy phép lái xe
                </label>
                <select
                  id="driverLicenseGrade"
                  name="driverLicenseGrade"
                  value={formData.driverLicenseGrade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B2">B2</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center">
              <input
                id="agreeTerms"
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                required
              />
              <label
                htmlFor="agreeTerms"
                className="ml-2 text-sm text-gray-700"
              >
                Tôi đồng ý với{" "}
                <Link
                  href="/terms"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  điều khoản và điều kiện
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-8">
            Đã có tài khoản?{" "}
            <Link
              href="/auth/signin"
              className="text-green-600 hover:text-green-700 font-bold"
            >
              Đăng nhập
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
