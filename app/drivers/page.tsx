"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { Star, ArrowRight, Navigation, Car, DollarSign } from "lucide-react";
import EmergencySection from "@/components/EmergencySection";
import { formatCurrency } from "../utils/helpers";

export default function DriverDashboard() {
  const { user, isSignedIn } = useAuth();
  const [stats, setStats] = useState({
    balance: -1,
    averageRating: -1,
  });

  useEffect(() => {
    // Load stats from API or set defaults
    if (isSignedIn && user) {
      // TODO: Fetch real stats from API
      // For now, we'll use placeholder stats
      setStats({
        balance: user.currentBalance || 0,
        averageRating: user.averageRating || 0,
      });
    }
  }, [isSignedIn, user]);

  // Check if user is logged in and is a driver
  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vui lòng đăng nhập</p>
          <Link href="/auth/signin">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Quay lại đăng nhập
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is a driver
  if (user.userType !== "Driver") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập trang này
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Trang này chỉ dành cho tài xế
          </p>
          <Link href="/">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Quay lại trang chủ
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const driverName = user.name || "Tài xế";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chào, {driverName}!
              </h1>
              <p className="text-gray-600">
                Sẵn sàng cho một ngày làm việc tốt?
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Quản lý xe và chuyến đi của bạn từ đây
              </p>
            </div>
            <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {driverName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Driver Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Total Earnings */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(stats.balance)}
            </div>
            <p className="text-gray-600 text-sm">Số dư</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.averageRating}
            </div>
            <p className="text-gray-600 text-sm">Đánh giá trung bình</p>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Manage Vehicles */}
          <Link href="/drivers/vehicles">
            <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-lg shadow-md p-8 hover:shadow-lg transition cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Quản lý xe</h3>
                  <p className="mb-4 text-blue-100">
                    Xem, thêm, chỉnh sửa và xóa các phương tiện của bạn
                  </p>
                  <div className="inline-flex items-center gap-2 font-semibold">
                    Quản lý <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <Car className="w-16 h-16 opacity-80" />
              </div>
            </div>
          </Link>

          {/* View Trips */}
          <Link href="/drivers/trips">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Chuyến đi của tôi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Xem chi tiết tất cả chuyến đi đã giao cho bạn
                  </p>
                  <div className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                    Xem <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <Navigation className="w-16 h-16 text-blue-600 opacity-20" />
              </div>
            </div>
          </Link>
        </div>

        {/* Support Section */}
        <EmergencySection />
      </div>
    </div>
  );
}
