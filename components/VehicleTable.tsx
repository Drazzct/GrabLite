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
  // Skeleton card cho mobile
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-gray-100 rounded w-24" />
        <div className="h-6 bg-gray-100 rounded-full w-20" />
      </div>
      <div className="h-4 bg-gray-100 rounded w-36" />
      <div className="flex gap-2">
        <div className="h-4 bg-gray-100 rounded w-20" />
        <div className="h-4 bg-gray-100 rounded w-16" />
      </div>
      <div className="flex justify-end gap-2">
        <div className="h-8 bg-gray-100 rounded w-16" />
        <div className="h-8 bg-gray-100 rounded w-16" />
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 space-y-3">
      <Car className="w-16 h-16 text-gray-300" />
      <p className="text-gray-600 font-semibold">Chưa có phương tiện</p>
      <p className="text-gray-500 text-sm">Hãy thêm xe đầu tiên của bạn</p>
    </div>
  );

  return (
    <>
      {/* ── MOBILE: card list ── */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md">
            <EmptyState />
          </div>
        ) : (
          vehicles.map((v) => (
            <div
              key={v.VEHICLE_ID}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-2"
            >
              {/* Row 1: biển số + trạng thái */}
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-600 text-base">
                  {v.PLATE_NUMBER}
                </span>
                <button
                  onClick={() => onSwitch(v.VEHICLE_ID)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
                    v.CURRENT_STATUS === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Power className="w-3 h-3" />
                  {v.CURRENT_STATUS === "ACTIVE" ? "Đang dùng" : "Không dùng"}
                </button>
              </div>

              {/* Row 2: hãng & dòng xe */}
              <p className="text-gray-900 font-medium text-sm">
                {v.MAKE} – {v.MODEL}
              </p>

              {/* Row 3: màu, sức chứa, dịch vụ */}
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5">
                  {v.COLOR}
                </span>
                <span className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5">
                  {v.CAPACITY} chỗ
                </span>
                <span className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5">
                  {v.SERVICE_TYPE}
                </span>
              </div>

              {/* Row 4: actions */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => onEdit(v)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition font-medium"
                >
                  <Edit className="w-3.5 h-3.5" /> Sửa
                </button>
                <button
                  onClick={() => onDelete(v.VEHICLE_ID)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP: table ── */}
      <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 w-[14%]">
                  Biển số
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 w-[22%]">
                  Hãng & Dòng xe
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 w-[12%]">
                  Màu sắc
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-900 w-[10%]">
                  Sức chứa
                </th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900 w-[16%]">
                  Dịch vụ
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-900 w-[14%]">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-900 w-[12%]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                [...Array(4)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-5 bg-gray-100 rounded w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-gray-100 rounded w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-gray-100 rounded w-20" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-5 bg-gray-100 rounded w-12 mx-auto" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-gray-100 rounded w-20" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-6 bg-gray-100 rounded-full w-20 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-5 bg-gray-100 rounded w-24 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
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
                    <td className="px-6 py-4 text-gray-700">{v.COLOR}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 rounded px-3 py-1 text-sm font-medium">
                        {v.CAPACITY} chỗ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {v.SERVICE_TYPE}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onSwitch(v.VEHICLE_ID)}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                          v.CURRENT_STATUS === "ACTIVE"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
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
    </>
  );
}
