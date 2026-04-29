import React from "react";
import { Car, Edit, Trash2, Power } from "lucide-react";

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

interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onSwitch: (vehicleId: number) => void;
  onDelete: (vehicleId: number) => void;
  onEdit: (vehicle: Vehicle) => void;
}

export default function VehicleTable({
  vehicles,
  isLoading,
  onSwitch,
  onDelete,
  onEdit,
}: VehicleTableProps) {
  return (
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
              <th className="px-6 py-4 text-left font-semibold text-gray-900">
                Màu sắc
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-900">
                Sức chứa
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-900">
                Dịch vụ
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
                  <td className="px-6 py-4">
                    <div className="h-5 bg-gray-100 rounded w-20"></div>
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
                <td colSpan={7} className="px-6 py-12 text-center">
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
              vehicles.map((v) => (
                <tr key={v.VEHICLE_ID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono font-semibold text-blue-600">
                    {v.PLATE_NUMBER}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {v.MAKE} - {v.MODEL}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{v.COLOR}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 rounded px-3 py-1 text-sm font-medium">
                      {v.CAPACITY} chỗ
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{v.SERVICE_TYPE}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onSwitch(v.VEHICLE_ID)}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                        v.CURRENT_STATUS === "ACTIVE"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={
                        v.CURRENT_STATUS === "ACTIVE"
                          ? "Đang sử dụng - Bấm để dừng"
                          : "Không sử dụng - Bấm để sử dụng"
                      }
                    >
                      <Power className="w-4 h-4" />
                      <span className="text-sm">
                        {v.CURRENT_STATUS === "ACTIVE"
                          ? "Đang dùng"
                          : "Không dùng"}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(v)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                        title="Sửa thông tin xe"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(v.VEHICLE_ID)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
                        title="Xóa xe"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
}
