"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Car } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VehiclePage() {
  const { user, isSignedIn } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const driverId = user?.id || 8;

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

  // State cho Form thêm xe
  const [formData, setFormData] = useState({
    plateNumber: "",
    make: "",
    model: "",
    color: "",
    capacity: 4,
    modeIdsList: "1", // Mặc định loại xe số 1
  });

  const [filters, setFilters] = useState({
    modeType: "", // 'Bike' hoặc 'Car'
    minCapacity: "",
    sortOption: "CAPACITY_DESC",
  });

  // Hàm lấy dữ liệu từ API
  // 2. Bọc hàm fetchVehicles bằng useCallback
  const fetchVehicles = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      driverId: driverId.toString(),
      sortOption: filters.sortOption,
    });

    if (filters.modeType) params.append("modeType", filters.modeType);
    if (filters.minCapacity) params.append("minCapacity", filters.minCapacity);

    fetch(`/api/vehicles?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setIsLoading(false);
      });
  }, [driverId, filters.modeType, filters.minCapacity, filters.sortOption]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Hàm xử lý gửi form
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/vehicles/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          registrantId: driverId,
          usingDriverId: null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Thêm xe thành công!");
        setIsOpen(false);
        fetchVehicles();
      } else {
        toast.error("Lỗi: " + data.error);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối!");
    }
  };

  // Thêm hàm này vào bên trong function VehiclePage()
  const handleDelete = async (vehicleId: number) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    if (!confirm("Bạn có chắc chắn muốn xóa phương tiện này không?")) return;

    try {
      const res = await fetch(`/api/vehicles/delete?vehicleId=${vehicleId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Đã xóa phương tiện thành công!");
        fetchVehicles();
      } else {
        toast.error("Lỗi khi xóa: " + data.error);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối khi xóa!");
    }
  };

  const handleSwitch = async (vehicleId: number) => {
    try {
      const res = await fetch("/api/vehicles/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicleId,
          driverId: driverId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Đã thay đổi xe đang sử dụng!");
        fetchVehicles();
      } else {
        toast.error("Lỗi: " + data.error);
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi cập nhật!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý phương tiện
          </h1>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Thêm xe
          </button>
        </div>

        {/* Filters section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loại xe
              </label>
              <select
                className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                value={filters.modeType}
                onChange={(e) =>
                  setFilters({ ...filters, modeType: e.target.value })
                }
              >
                <option value="">Tất cả</option>
                <option value="Bike">Bike</option>
                <option value="Car">Car</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sức chứa tối thiểu
              </label>
              <input
                type="number"
                placeholder="VD: 4"
                className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                value={filters.minCapacity}
                onChange={(e) =>
                  setFilters({ ...filters, minCapacity: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <select
                className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                value={filters.sortOption}
                onChange={(e) =>
                  setFilters({ ...filters, sortOption: e.target.value })
                }
              >
                <option value="CAPACITY_DESC">Sức chứa (Giảm dần)</option>
                <option value="CAPACITY_ASC">Sức chứa (Tăng dần)</option>
                <option value="MAKE">Theo hãng xe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Biển số
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Hãng & Dòng xe
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    Sức chứa
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">
                    Loại xe
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  [...Array(4)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-5 bg-gray-100 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-gray-100 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="h-5 bg-gray-100 rounded w-12 mx-auto"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-gray-100 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="h-6 bg-gray-100 rounded-full w-20 mx-auto"></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="h-5 bg-gray-100 rounded w-24 mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Car className="w-16 h-16 text-gray-300" />
                        <p className="text-gray-600 font-semibold">
                          Chưa có phương tiện
                        </p>
                        <p className="text-gray-500 text-sm">
                          Hãy thêm xe đầu tiên của bạn
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v: any) => (
                    <tr
                      key={v.VEHICLE_ID}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-blue-600">
                        {v.PLATE_NUMBER}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {v.MAKE} - {v.MODEL}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 rounded px-3 py-1 text-sm font-medium">
                          {v.CAPACITY} chỗ
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{v.MODE}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            v.CURRENT_STATUS === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {v.CURRENT_STATUS === "ACTIVE"
                            ? "Hoạt động"
                            : "Không hoạt động"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSwitch(v.VEHICLE_ID)}
                            disabled={v.CURRENT_STATUS === "ACTIVE"}
                            className={`px-3 py-1 rounded text-sm font-medium transition ${
                              v.CURRENT_STATUS === "ACTIVE"
                                ? "text-gray-300 cursor-default"
                                : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            }`}
                          >
                            Sử dụng
                          </button>
                          <button
                            onClick={() => handleDelete(v.VEHICLE_ID)}
                            className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded text-sm font-medium transition"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Đăng ký xe mới
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center text-2xl transition"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {" "}
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Biển số (VD: 29A-123.45)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                    placeholder="29A-123.45"
                    onChange={(e) =>
                      setFormData({ ...formData, plateNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Màu sắc
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                    placeholder="Trắng"
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hãng xe
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                    placeholder="Toyota"
                    onChange={(e) =>
                      setFormData({ ...formData, make: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dòng xe
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                    placeholder="Camry"
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sức chứa
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                    defaultValue={4}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div> */}

              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Loại xe (Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 p-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  placeholder="1, 2"
                  onChange={(e) =>
                    setFormData({ ...formData, modeIdsList: e.target.value })
                  }
                />
              </div> */}

              {/* Chọn loại xe - thay thế cả "Sức chứa" lẫn "ID Loại xe" */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại xe & Dịch vụ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: "1",
                      label: "Xe máy",
                      sub: "Standard",
                      image: "/vehicles/bike.png",
                      capacity: 1,
                    },
                    {
                      id: "2",
                      label: "Xe máy",
                      sub: "Tiết kiệm",
                      image: "/vehicles/bike_saver.png",
                      capacity: 1,
                    },
                    {
                      id: "3",
                      label: "Xe hơi 4 chỗ",
                      sub: "Standard",
                      image: "/vehicles/car4.png",
                      capacity: 4,
                    },
                    {
                      id: "4",
                      label: "Xe hơi 4 chỗ",
                      sub: "Tiết kiệm",
                      image: "/vehicles/car4_saver.png",
                      capacity: 4,
                    },
                    {
                      id: "5",
                      label: "Xe hơi 4 chỗ",
                      sub: "Electric",
                      image: "/vehicles/car_electric.png",
                      capacity: 4,
                    },
                    {
                      id: "6",
                      label: "Xe hơi 6 chỗ",
                      sub: "Standard",
                      image: "/vehicles/car6.png",
                      capacity: 6,
                    },
                  ].map((mode) => {
                    const selected = formData.modeIdsList
                      .split(",")
                      .map((s) => s.trim())
                      .includes(mode.id);

                    const toggleMode = () => {
                      const current = formData.modeIdsList
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      const updated = selected
                        ? current.filter((x) => x !== mode.id)
                        : [...current, mode.id];

                      // Tính capacity cao nhất trong các mode đã chọn
                      const allModes = [
                        { id: "1", capacity: 1 },
                        { id: "2", capacity: 1 },
                        { id: "3", capacity: 4 },
                        { id: "4", capacity: 4 },
                        { id: "5", capacity: 4 },
                        { id: "6", capacity: 6 },
                      ];
                      const maxCapacity =
                        updated.length > 0
                          ? Math.max(
                              ...updated.map(
                                (id) =>
                                  allModes.find((m) => m.id === id)?.capacity ??
                                  1,
                              ),
                            )
                          : 1;

                      setFormData({
                        ...formData,
                        modeIdsList: updated.join(", "),
                        capacity: maxCapacity,
                      });
                    };

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={toggleMode}
                        className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 transition-all ${
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <img
                          src={mode.image}
                          alt={mode.label}
                          className="h-10 object-contain"
                        />
                        <div className="text-center">
                          <div className="text-sm font-semibold leading-tight text-gray-900">
                            {mode.label}
                          </div>
                          <div
                            className={`text-xs ${selected ? "text-blue-600" : "text-gray-500"}`}
                          >
                            {mode.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors focus:outline-none"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors focus:outline-none"
              >
                Xác nhận thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
