"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import VehicleFilters from "@/components/VehicleFilters";
import VehicleTable from "@/components/VehicleTable";
import AddVehicleModal from "@/components/AddVehicleModal";
import EditVehicleModal from "@/components/EditVehicleModal";
import { useAuth } from "@/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultFormData = {
  plateNumber: "",
  make: "",
  model: "",
  color: "",
  capacity: 5,
  modeIdsList: "1",
};

interface Vehicle {
  VEHICLE_ID: number;
  PLATE_NUMBER: string;
  MAKE: string;
  MODEL: string;
  COLOR: string;
  CAPACITY: number;
  SERVICE_TYPE: string;
  CURRENT_STATUS: string;
}

interface FilterState {
  serviceLevel: string;
  capacity: string;
  sortOption: string;
  plateNumber: string;
}

export default function VehiclePage() {
  const { user, isSignedIn } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const driverId = user?.id || 8;
  const itemsPerPage = 10;

  // State cho Form thêm xe
  const [formData, setFormData] = useState(defaultFormData);

  const [filters, setFilters] = useState<FilterState>({
    serviceLevel: "",
    capacity: "",
    sortOption: "CAPACITY_DESC",
    plateNumber: "",
  });

  // Hàm lấy tổng số vehicle
  const fetchTotalVehicles = useCallback(() => {
    const params = new URLSearchParams({
      driverId: driverId.toString(),
    });

    if (filters.serviceLevel)
      params.append("serviceLevel", filters.serviceLevel);
    if (filters.capacity) params.append("capacity", filters.capacity);
    if (filters.plateNumber) params.append("plateNumber", filters.plateNumber);

    fetch(`/api/vehicles/count?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const totalCount = data.total_count || 0;
        const calculatedPages = Math.ceil(totalCount / itemsPerPage) || 1;
        setTotalPages(calculatedPages);
      })
      .catch((err) => {
        console.error("Lỗi lấy tổng số vehicle:", err);
      });
  }, [
    driverId,
    filters.serviceLevel,
    filters.capacity,
    filters.plateNumber,
    itemsPerPage,
  ]);

  // Hàm lấy dữ liệu từ API
  const fetchVehicles = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      driverId: driverId.toString(),
      sortOption: filters.sortOption,
      limit: itemsPerPage.toString(),
      offset: ((currentPage - 1) * itemsPerPage).toString(),
    });

    if (filters.serviceLevel)
      params.append("serviceLevel", filters.serviceLevel);
    if (filters.capacity) params.append("capacity", filters.capacity);
    if (filters.plateNumber) params.append("plateNumber", filters.plateNumber);

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
  }, [
    driverId,
    filters.serviceLevel,
    filters.capacity,
    filters.sortOption,
    filters.plateNumber,
    currentPage,
    itemsPerPage,
  ]);

  useEffect(() => {
    fetchTotalVehicles();
    fetchVehicles();
  }, [fetchVehicles, fetchTotalVehicles]);

  // Hàm xử lý gửi form thêm xe
  const handleAddVehicle = async () => {
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
        setIsAddModalOpen(false);
        setFormData(defaultFormData);
        fetchTotalVehicles();
        fetchVehicles();
      } else {
        toast.error("Lỗi: " + data.error);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối!");
    }
  };

  // Hàm xóa xe
  const handleDelete = async (vehicleId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phương tiện này không?")) return;

    try {
      const res = await fetch(`/api/vehicles/delete?vehicleId=${vehicleId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Đã xóa phương tiện thành công!");
        fetchTotalVehicles();
        fetchVehicles();
      } else {
        toast.error("Lỗi khi xóa: " + data.error);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối khi xóa!");
    }
  };

  // Hàm chuyển xe đang sử dụng
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

  // Hàm mở modal sửa xe
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsEditModalOpen(true);
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
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Thêm xe
          </button>
        </div>

        {/* Filters */}
        <VehicleFilters filters={filters} onFiltersChange={setFilters} />

        {/* Vehicles Table */}
        <VehicleTable
          vehicles={vehicles}
          isLoading={isLoading}
          onSwitch={handleSwitch}
          onDelete={handleDelete}
          onEdit={handleEditVehicle}
        />

        {/* Pagination */}
        {vehicles.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFormData(defaultFormData);
        }}
        onSubmit={handleAddVehicle}
        formData={formData}
        onFormChange={(key, value) =>
          setFormData((prev) => ({ ...prev, [key]: value }))
        }
      />

      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        isOpen={isEditModalOpen}
        vehicle={editingVehicle}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingVehicle(null);
        }}
        onSuccess={() => {
          setIsEditModalOpen(false);
          setEditingVehicle(null);
          fetchTotalVehicles();
          fetchVehicles();
        }}
        driverId={driverId}
      />
    </div>
  );
}
