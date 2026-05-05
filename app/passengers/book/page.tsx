"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  Clock,
  DollarSign,
  Phone,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";

export default function BookRidePage() {
  const { user, isSignedIn } = useAuth();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [rideType, setRideType] = useState("grabx");
  const [estimatedPrice, setEstimatedPrice] = useState(45000);
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [step, setStep] = useState(1); // 1: Location, 2: Confirmation

  // Check if user is logged in and is a passenger
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

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickupLocation && dropoffLocation) {
      // Simulate price and time calculation
      setEstimatedPrice(45000 + Math.random() * 50000);
      setEstimatedTime(Math.floor(5 + Math.random() * 15));
      setStep(2);
    }
  };

  const handleBookRide = () => {
    alert(
      `Chuyến đi đã được đặt!\nĐiểm xuất phát: ${pickupLocation}\nĐiểm đến: ${dropoffLocation}\nGiá tiền: ${Math.floor(estimatedPrice).toLocaleString()} đ`,
    );
    // Reset form
    setPickupLocation("");
    setDropoffLocation("");
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 relative pointer-events-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Đặt chuyến đi của bạn
              </h1>

              {step === 1 ? (
                // Location Selection Step
                <form onSubmit={handleLocationSubmit} className="space-y-6">
                  {/* Pickup Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Điểm xuất phát
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-green-600" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Nhập địa chỉ xuất phát"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      VD: 123 Nguyễn Huệ, TP.HCM
                    </p>
                  </div>

                  {/* Dropoff Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Điểm đến
                    </label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-3 w-5 h-5 text-red-600" />
                      <input
                        type="text"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        placeholder="Nhập địa chỉ đến"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      VD: 456 Lê Lợi, TP.HCM
                    </p>
                  </div>

                  {/* Ride Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Loại xe
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          id: "grabx",
                          name: "GrabX",
                          desc: "Giá tiền tốt",
                          image: "/vehicles/bike.png",
                        },
                        {
                          id: "grabcar",
                          name: "GrabCar",
                          desc: "Tiêu chuẩn",
                          image: "/vehicles/car4.png",
                        },
                        {
                          id: "grabpremium",
                          name: "GrabPremium",
                          desc: "Xe cao cấp",
                          image: "/vehicles/car_electric.png",
                        },
                        {
                          id: "grabfamily",
                          name: "GrabFamily",
                          desc: "7 chỗ",
                          image: "/vehicles/car6.png",
                        },
                        {
                          id: "grabbike",
                          name: "GrabBike",
                          desc: "Xe máy",
                          image: "/vehicles/bike_saver.png",
                        },
                        {
                          id: "grabshare",
                          name: "GrabShare",
                          desc: "Chia sẻ chuyến",
                          image: "/vehicles/car4_saver.png",
                        },
                      ].map((type) => (
                        <div key={type.id} className="relative">
                          <button
                            type="button"
                            onClick={() => setRideType(type.id)}
                            className={`w-full p-4 rounded-lg border-2 transition flex flex-col items-center gap-3 ${
                              rideType === type.id
                                ? "border-green-600 bg-green-50"
                                : "border-gray-300 hover:border-gray-400 cursor-pointer"
                            }`}
                          >
                            <img
                              src={type.image}
                              alt={type.name}
                              className="h-12 object-contain"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">
                                {type.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                {type.desc}
                              </div>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition text-lg"
                  >
                    Xem giá tiền & tài xế
                  </button>
                </form>
              ) : (
                // Confirmation Step
                <div className="space-y-6">
                  {/* Trip Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      Chi tiết chuyến đi
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Xuất phát</p>
                          <p className="font-semibold text-gray-900">
                            {pickupLocation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Navigation className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Đến</p>
                          <p className="font-semibold text-gray-900">
                            {dropoffLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ride Type Selected */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      Loại xe đã chọn
                    </h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {rideType === "grabx"
                            ? "GrabX"
                            : rideType === "grabcar"
                              ? "GrabCar"
                              : rideType === "grabpremium"
                                ? "GrabPremium"
                                : rideType === "grabfamily"
                                  ? "GrabFamily"
                                  : rideType === "grabbike"
                                    ? "GrabBike"
                                    : "GrabShare"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {rideType === "grabx"
                            ? "Giá tiền tốt"
                            : rideType === "grabcar"
                              ? "Tiêu chuẩn"
                              : rideType === "grabpremium"
                                ? "Xe cao cấp"
                                : rideType === "grabfamily"
                                  ? "7 chỗ"
                                  : rideType === "grabbike"
                                    ? "Xe máy"
                                    : "Chia sẻ chuyến"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                      >
                        Thay đổi
                      </button>
                    </div>
                  </div>

                  {/* Estimated Price and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Giá dự tính</p>
                      <p className="text-2xl font-bold text-green-700">
                        {Math.floor(estimatedPrice).toLocaleString()} đ
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Thời gian dự tính
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {estimatedTime} phút
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleBookRide}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg"
                    >
                      Đặt xe ngay
                    </button>
                  </div>
                </div>
              )}

              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl inline-block">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Sắp ra mắt
                    </h3>
                    <p className="text-gray-600">
                      Tính năng đặt xe sẽ sớm được mở
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Info & Tips */}
          <div className="space-y-6">
            {/* Driver Info (Only on confirmation) */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Tài xế gần nhất
                </h2>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                    NV
                  </div>
                  <h3 className="font-semibold text-gray-900">Nguyễn Văn B</h3>
                  <div className="flex justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    4.9 (128 đánh giá)
                  </p>
                </div>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Biển số xe:</span>
                    <span className="font-semibold">123-AB-456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Loại xe:</span>
                    <span className="font-semibold">Toyota Vios</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium">
                    <Phone className="w-4 h-4" />
                    Gọi
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium">
                    <MessageSquare className="w-4 h-4" />
                    Nhắn
                  </button>
                </div>
              </div>
            )}

            {/* Tips & Safety */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Mẹo đi Grab
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Chia sẻ chi tiết chuyến đi với bạn bè</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Kiểm tra biển số và thông tin tài xế</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Luôn đeo dây an toàn trên Grab Car</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Đánh giá tài xế sau chuyến đi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
