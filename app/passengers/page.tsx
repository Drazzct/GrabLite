"use client";

import Link from "next/link";
import { Clock, ArrowRight, Navigation, Phone } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import EmergencySection from "@/components/EmergencySection";

export default function PassengerDashboard() {
  const { user, isSignedIn } = useAuth();

  // Check if user is logged in
  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Vui lòng đăng nhập</p>
          <Link href="/auth/signin">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Quay lại đăng nhập
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is a passenger
  if (user.userType !== "Passenger") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Bạn không có quyền truy cập trang này
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Trang này chỉ dành cho hành khách
          </p>
          <Link href="/">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Quay lại trang chủ
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const userName = user?.name || "Khách hàng";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Welcome Section */}
        <div className="gap-6 mb-12">
          {/* User Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Chào, {userName}!
                </h1>
                <p className="text-gray-600">
                  Sẵn sàng cho chuyến đi tiếp theo?
                </p>
              </div>
              <div className="w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Book a Ride Card */}
          <Link href="/passengers/book">
            <div className="bg-linear-to-br from-green-600 to-green-700 text-white rounded-lg shadow-md p-8 hover:shadow-lg transition cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Đặt xe ngay</h3>
                  <p className="mb-4">Đặt chuyến đi của bạn trong vài giây</p>
                  <button className="inline-flex items-center gap-2 font-semibold">
                    Bắt đầu <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <Navigation className="w-16 h-16  opacity-80" />
              </div>
            </div>
          </Link>

          {/* View Trips Card */}
          <Link href="/passengers/trips">
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Lịch sử chuyến đi
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Xem chi tiết tất cả chuyến đi của bạn
                  </p>
                  <button className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold">
                    Xem <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <Clock className="w-16 h-16 text-blue-600 opacity-20" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Trips Section */}

        <EmergencySection />
      </div>
    </div>
  );
}
