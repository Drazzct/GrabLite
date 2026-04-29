import React, { useState } from "react";
import { toast } from "react-toastify";

interface ModeData {
  id: string;
  label: string;
  sub: string;
  image: string;
  capacity: number;
}

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

interface EditVehicleModalProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSuccess: () => void;
  driverId: number;
}

const MODES: ModeData[] = [
  {
    id: "1",
    label: "Xe máy",
    sub: "Tiêu chuẩn",
    image: "/vehicles/bike.png",
    capacity: 2,
  },
  {
    id: "2",
    label: "Xe máy",
    sub: "Tiết kiệm",
    image: "/vehicles/bike_saver.png",
    capacity: 2,
  },
  {
    id: "3",
    label: "Xe hơi 4 chỗ",
    sub: "Tiêu chuẩn",
    image: "/vehicles/car4.png",
    capacity: 5,
  },
  {
    id: "4",
    label: "Xe hơi 4 chỗ",
    sub: "Tiết kiệm",
    image: "/vehicles/car4_saver.png",
    capacity: 5,
  },
  {
    id: "5",
    label: "Xe hơi 4 chỗ",
    sub: "Xe điện",
    image: "/vehicles/car_electric.png",
    capacity: 5,
  },
  {
    id: "6",
    label: "Xe hơi 6 chỗ",
    sub: "Tiêu chuẩn",
    image: "/vehicles/car6.png",
    capacity: 7,
  },
];

export default function EditVehicleModal({
  isOpen,
  vehicle,
  onClose,
  onSuccess,
  driverId,
}: EditVehicleModalProps) {
  const [plateNumber, setPlateNumber] = useState("");
  const [color, setColor] = useState("");
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = React.useState(false);
  const [isTogglingMode, setIsTogglingMode] = useState(false);

  React.useEffect(() => {
    if (vehicle) {
      setPlateNumber(vehicle.PLATE_NUMBER);
      setColor(vehicle.COLOR);

      // Fetch MODE_IDs from database
      fetch(`/api/vehicles/modes?vehicleId=${vehicle.VEHICLE_ID}`)
        .then((res) => res.json())
        .then((data) => {
          setSelectedModes(data.modeIds || ["1"]);
        })
        .catch((err) => {
          console.error("Error fetching modes:", err);
          setSelectedModes(["1"]); // Default fallback
        });
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const toggleMode = async (modeId: string) => {
    if (isTogglingMode) return; // Prevent multiple requests

    const isSelected = selectedModes.includes(modeId);
    setIsTogglingMode(true);

    try {
      if (isSelected) {
        // Remove mode
        const res = await fetch(
          `/api/vehicles/remove-mode?vehicleId=${vehicle.VEHICLE_ID}&modeId=${modeId}`,
          { method: "DELETE" },
        );
        const data = await res.json();

        if (data.success) {
          setSelectedModes((prev) => prev.filter((x) => x !== modeId));
          toast.success("Đã xóa dịch vụ");
        } else {
          toast.error("Lỗi: " + data.error);
        }
      } else {
        // Add mode
        const res = await fetch("/api/vehicles/add-mode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleId: vehicle.VEHICLE_ID,
            modeId: parseInt(modeId),
          }),
        });
        const data = await res.json();

        if (data.success) {
          setSelectedModes((prev) => [...prev, modeId]);
          toast.success("Đã thêm dịch vụ");
        } else {
          toast.error("Lỗi: " + data.error);
        }
      }
    } catch (error) {
      toast.error("Lỗi kết nối!");
    } finally {
      setIsTogglingMode(false);
    }
  };

  // Check if any bike mode is selected (modes 1, 2)
  const isBikeSelected = selectedModes.some((id) => ["1", "2"].includes(id));
  // Check if any car mode is selected (modes 3, 4, 5, 6)
  const isCarSelected = selectedModes.some((id) =>
    ["3", "4", "5", "6"].includes(id),
  );

  const isModeEnabled = (modeId: string) => {
    return MODES[Number(modeId) - 1].capacity === vehicle.CAPACITY;
  };

  const handleUpdatePlate = async () => {
    if (!plateNumber.trim()) {
      setShowErrors(true);
      toast.error("Biển số không được trống");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vehicles/update-plate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.VEHICLE_ID,
          plateNumber: plateNumber,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Cập nhật biển số thành công!");
        onSuccess();
      } else {
        toast.error("Lỗi: " + data.error);
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi cập nhật biển số!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateColor = async () => {
    if (!color.trim()) {
      setShowErrors(true);
      toast.error("Màu sắc không được trống");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vehicles/update-color", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.VEHICLE_ID,
          color: color,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Cập nhật màu sắc thành công!");
        onSuccess();
      } else {
        toast.error("Lỗi: " + data.error);
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi cập nhật màu sắc!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Sửa thông tin xe: {vehicle.PLATE_NUMBER}
          </h2>
          <button
            onClick={() => {
              onClose();
              setShowErrors(false);
            }}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center text-2xl transition"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Thông tin xe (read-only) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Thông tin xe</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Hãng & dòng xe</p>
                <p className="font-medium text-gray-900">
                  {vehicle.MAKE} - {vehicle.MODEL}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Sức chứa</p>
                <p className="font-medium text-gray-900">
                  {vehicle.CAPACITY} chỗ
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Sửa biển số */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Sửa biển số xe</h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="VD: 29A-123.45"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                />
                {showErrors && !plateNumber.trim() && (
                  <p className="text-xs text-red-600 mt-1">
                    Biển số không được trống
                  </p>
                )}
              </div>
              <button
                onClick={handleUpdatePlate}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>

          {/* Section 2: Sửa màu sắc */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Sửa màu sắc</h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="VD: Trắng, Đen, Xám..."
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                {showErrors && !color.trim() && (
                  <p className="text-xs text-red-600 mt-1">
                    Màu sắc không được trống
                  </p>
                )}
              </div>
              <button
                onClick={handleUpdateColor}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>

          {/* Section 3: Sửa loại dịch vụ */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              Sửa loại dịch vụ
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {MODES.filter((mode) => isModeEnabled(mode.id)).map((mode) => {
                const selected = selectedModes.includes(mode.id);

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => toggleMode(mode.id)}
                    disabled={selectedModes.length === 1 && selected}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 transition-all disabled:cursor-not-allowed ${
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
            onClick={() => {
              onClose();
              setShowErrors(false);
            }}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors focus:outline-none"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
