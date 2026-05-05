"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  AlertCircle,
  Navigation,
  Car,
  User,
  Zap,
  Wallet,
  Gift,
  Coins,
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { calculateDuration, formatTime } from "@/app/utils/helpers";

interface Trip {
  tripId: number;
  status: "PENDING" | "ACCEPTED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  bookingTime: string;
  fromAddress: string;
  toAddress: string;
  finalPrice: number;
  usedGrabcoins: number;
  vehicleType: string;
  serviceLevel: string;
  driverName: string;
  ratingStars?: number;
  feedback?: string;
  startTime?: string;
  completionTime?: string;
}

export default function PassengerTripsPage() {
  const { user, isSignedIn } = useAuth();
  const [reportData, setReportData] = useState<any[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const passengerId = user?.id || 1;
  const [monthsBack, setMonthsBack] = useState(12);
  const [isPending, setIsPending] = useState(false);

  const fetchReport = useCallback(() => {
    setIsLoadingReport(true);
    setIsPending(true);

    fetch(`/api/passengers?passengerId=${passengerId}&monthsBack=${monthsBack}`)
      .then((res) => res.json())
      .then((data) => {
        setReportData(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching report:", err);
        setReportData([]);
      })
      .finally(() => {
        setIsLoadingReport(false);
        setIsPending(false);
      });
  }, [passengerId, monthsBack]);

  const fetchTrips = useCallback(async () => {
    try {
      setIsLoadingTrips(true);

      const response = await fetch(
        `/api/passengers/trips?passengerId=${passengerId}&limit=50&offset=0`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tải danh sách chuyến đi");
      }

      setTrips(data || []);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setTrips([]);
    } finally {
      setIsLoadingTrips(false);
    }
  }, [passengerId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-700";
      case "ONGOING":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "ACCEPTED":
        return "Đã xác nhận";
      case "ONGOING":
        return "Đang chạy";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Lịch sử chuyến đi của bạn
          </h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và quản lý các chuyến đi của bạn
          </p>
        </div>

        {/* Time Filter and Report */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <label className="font-semibold text-gray-700">
              Xem báo cáo từ:
            </label>
            <select
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={monthsBack}
              onChange={(e) => setMonthsBack(Number(e.target.value))}
            >
              <option value={3}>3 tháng gần nhất</option>
              <option value={6}>6 tháng gần nhất</option>
              <option value={12}>12 tháng gần nhất</option>
              <option value={24}>24 tháng gần nhất</option>
            </select>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Chuyến đi theo tháng
          </h2>

          {isLoadingReport && reportData.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 rounded-lg h-32"
                />
              ))}
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-200 ${
                isPending ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              {reportData.length > 0 ? (
                reportData.map((item: any) => (
                  <div
                    key={item.Reporting_Month}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all group border border-gray-200"
                  >
                    {/* Header */}
                    <div className="bg-linear-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                            {item.Reporting_Month}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Báo cáo chuyến đi
                          </p>
                        </div>
                        <Calendar className="w-5 h-5 text-green-600 opacity-60" />
                      </div>
                    </div>

                    {/* Main Stats */}
                    <div className="px-6 py-4">
                      {/* Total Trips */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-3xl font-bold text-green-700">
                            {item.Total_Trips}
                          </span>
                          <span className="text-gray-600 font-medium">
                            chuyến
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Tổng chuyến đi hoàn thành
                        </p>
                      </div>

                      {/* Service Breakdown */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
                          Phân loại dịch vụ
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-500" />
                              <span className="text-sm text-gray-600">
                                Xe điện
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {item.Electric_Rides || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-600">
                                Tiết kiệm
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {item.Saver_Rides || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Financial Analysis */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
                          Phân tích tài chính
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Giá ước tính
                            </span>
                            <span className="font-medium text-gray-900">
                              {item.Gross_Estimate?.toLocaleString()}₫
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Thực trả
                            </span>
                            <span className="font-medium text-green-700">
                              {item.Actual_Spent?.toLocaleString()}₫
                            </span>
                          </div>
                          <div className="flex justify-between bg-green-50 px-2 py-1 rounded">
                            <span className="text-sm text-green-700 font-medium">
                              Tiết kiệm
                            </span>
                            <span className="font-bold text-green-700">
                              +{item.Total_Saved?.toLocaleString()}₫
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Loyalty Rewards */}
                      <div>
                        <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
                          Phần thưởng
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-amber-500" />
                              <span className="text-sm text-gray-600">
                                Xu GrabCoin
                              </span>
                            </div>
                            <span className="font-medium text-amber-600">
                              {item.Standard_Coins_Earned || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Gift className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-gray-600">
                                Bonus thân thiết
                              </span>
                            </div>
                            <span className="font-medium text-amber-600">
                              {item.Loyalty_Bonus_Earned || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-1">
                        Không có lịch sử chuyến đi
                      </p>
                      <p className="text-gray-500">
                        Không tìm thấy chuyến đi nào trong khoảng thời gian này.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detailed Trips List */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chi tiết chuyến đi
            </h2>
          </div>

          {/* Trips List */}
          {isLoadingTrips ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Đang tải chuyến đi...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">
                Chưa có chuyến đi
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Bạn chưa đặt chuyến đi nào
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div
                  key={trip.tripId}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {/* Trip Header */}
                  <div className="bg-linear-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Mã chuyến: {trip.tripId}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeColor(
                            trip.status,
                          )}`}
                        >
                          {getStatusLabel(trip.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatTime(trip.bookingTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">
                        {trip.finalPrice.toLocaleString()} đ
                      </div>
                      <p className="text-gray-600 text-xs mt-1">Tổng cộng</p>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="p-6 space-y-4">
                    {/* Locations */}
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold">
                                Điểm đón
                                {trip.startTime && (
                                  <span className="font-light">
                                    {" "}
                                    - {formatTime(trip.startTime)}
                                  </span>
                                )}
                              </p>
                              <p className="text-gray-900 font-medium">
                                {trip.fromAddress}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-semibold">
                                Điểm trả
                                {trip.completionTime && (
                                  <span className="font-light">
                                    {" "}
                                    - {formatTime(trip.completionTime)}
                                  </span>
                                )}
                              </p>
                              <p className="text-gray-900 font-medium">
                                {trip.toAddress}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trip Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-400">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Tài xế
                          </p>
                          <p className="text-gray-900 font-medium">
                            {trip.driverName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Loại xe
                          </p>
                          <p className="text-gray-900 font-medium">
                            {trip.vehicleType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">
                            Thời gian
                          </p>
                          <p className="text-gray-900 font-medium">
                            {calculateDuration(
                              trip.startTime,
                              trip.completionTime,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ratings */}
                    {trip.ratingStars !== undefined &&
                      trip.status === "COMPLETED" && (
                        <div className="pt-4 border-t border-gray-400">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900">
                              Đánh giá tài xế
                            </span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (trip.ratingStars || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">
                                {trip.ratingStars}/5
                              </span>
                            </div>
                          </div>
                          {trip.feedback && (
                            <p className="text-sm text-gray-600 italic mt-2 p-3 bg-gray-50 rounded">
                              "{trip.feedback}"
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Sẵn sàng cho chuyến đi tiếp theo?
          </h2>
          <p className="text-green-100 mb-6">
            Đặt chuyến đi ngay bây giờ và tận hưởng dịch vụ cao cấp của chúng
            tôi
          </p>
          <Link href="/passengers/book">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
              Đặt chuyến đi
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
