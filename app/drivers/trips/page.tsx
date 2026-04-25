"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import {
  MapPin,
  Clock,
  Star,
  Phone,
  AlertCircle,
  Navigation,
  Users,
  Car,
  Calendar,
} from "lucide-react";
import { calculateDuration, formatTime } from "@/app/utils/helpers";

interface Trip {
  tripId: number;
  status: "PENDING" | "ACCEPTED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  bookingTime: string;
  fromAddress: string;
  toAddress: string;
  finalPrice: number;
  vehicleType: string;
  passengerName: string;
  ratingStars?: number;
  feedback?: string;
  startTime?: string;
  completionTime?: string;
}

export default function DriverTripsPage() {
  const { user, isSignedIn } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrips = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        `/api/drivers/trips?driverId=${user?.id || 1}&limit=50&offset=0`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tải danh sách chuyến đi");
      }

      setTrips(data || []);
    } catch (err) {
      setError("Không thể tải danh sách chuyến đi. Vui lòng thử lại.");
      console.error("Error fetching trips:", err);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleAcceptTrip = async (tripId: number) => {
    try {
      // TODO: Call API to accept trip
      // const response = await fetch(`/api/drivers/trips/${tripId}/accept`, {
      //   method: "POST",
      // });
      // if (response.ok) {
      //   fetchTrips();
      // }

      // For now, just update the local state
      setTrips(
        trips.map((trip) =>
          trip.tripId === tripId ? { ...trip, status: "ACCEPTED" } : trip,
        ),
      );
    } catch (err) {
      console.error("Error accepting trip:", err);
    }
  };

  const handleCancelTrip = async (tripId: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy chuyến đi này?")) return;

    try {
      // TODO: Call API to cancel trip
      // const response = await fetch(`/api/drivers/trips/${tripId}/cancel`, {
      //   method: "POST",
      // });
      // if (response.ok) {
      //   fetchTrips();
      // }

      // For now, just update the local state
      setTrips(
        trips.map((trip) =>
          trip.tripId === tripId ? { ...trip, status: "CANCELLED" } : trip,
        ),
      );
    } catch (err) {
      console.error("Error cancelling trip:", err);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Chuyến đi của tôi
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Lỗi</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Trips List */}
        {isLoading ? (
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
              Bạn sẽ nhận được chuyến đi mới tại đây
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
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex items-start justify-between">
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
                    <p className="text-gray-600 text-xs mt-1">Cộng</p>
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">
                          Hành khách
                        </p>
                        <p className="text-gray-900 font-medium">
                          {trip.passengerName}
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
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900">
                            Đánh giá
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

                  {/* Action Buttons */}
                  {trip.status === "PENDING" && (
                    <div className="flex gap-2 pt-4 border-t">
                      <button
                        onClick={() => handleAcceptTrip(trip.tripId)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        ✓ Chấp nhận
                      </button>
                      <button
                        onClick={() => handleCancelTrip(trip.tripId)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold"
                      >
                        ✕ Từ chối
                      </button>
                    </div>
                  )}

                  {trip.status === "ACCEPTED" && (
                    <div className="pt-4 border-t">
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                        ▶ Bắt đầu chuyến đi
                      </button>
                    </div>
                  )}

                  {trip.status === "ONGOING" && (
                    <div className="pt-4 border-t">
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
                        ✓ Hoàn thành chuyến đi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
