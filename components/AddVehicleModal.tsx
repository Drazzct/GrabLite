import React, { useState } from "react";

interface ModeData {
  id: string;
  label: string;
  sub: string;
  image: string;
  capacity: number;
}

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: {
    plateNumber: string;
    make: string;
    model: string;
    color: string;
    capacity: number;
    modeIdsList: string;
  };
  onFormChange: (key: string, value: any) => void;
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

const MODE_GROUPS: Record<string, number> = {
  "1": 1,
  "2": 1,
  "3": 2,
  "4": 2,
  "5": 3,
  "6": 4,
};

export default function AddVehicleModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
}: AddVehicleModalProps) {
  const [showErrors, setShowErrors] = React.useState(false);

  if (!isOpen) return null;

  const selectedModeIds = formData.modeIdsList
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const selectedGroups = new Set(selectedModeIds.map((id) => MODE_GROUPS[id]));

  const toggleMode = (modeId: string) => {
    const current = formData.modeIdsList
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const selected = current.includes(modeId);
    const updated = selected
      ? current.filter((x) => x !== modeId)
      : [...current, modeId];

    const maxCapacity =
      updated.length > 0
        ? Math.max(
            ...updated.map(
              (id) => MODES.find((m) => m.id === id)?.capacity ?? 1,
            ),
          )
        : 1;

    onFormChange("modeIdsList", updated.join(","));
    onFormChange("capacity", maxCapacity);
  };

  // Validation
  const isPlateNumberEmpty = !formData.plateNumber.trim();
  const isMakeEmpty = !formData.make.trim();
  const isModelEmpty = !formData.model.trim();
  const isColorEmpty = !formData.color.trim();
  const isNoModeSelected = selectedModeIds.length === 0;
  const isFormValid =
    !isPlateNumberEmpty &&
    !isMakeEmpty &&
    !isModelEmpty &&
    !isColorEmpty &&
    !isNoModeSelected;

  const isModeDisabled = (modeId: string) => {
    if (selectedModeIds.length === 0) return false;
    return !selectedGroups.has(MODE_GROUPS[modeId]);
  };

  const handleSubmit = () => {
    setShowErrors(true);
    if (isFormValid) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Đăng ký xe mới</h2>
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
          {/* Section 1: Thông tin cơ bản */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Biển số (VD: 29A-123.45)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  placeholder="29A-123.45"
                  value={formData.plateNumber}
                  onChange={(e) => onFormChange("plateNumber", e.target.value)}
                />
                {showErrors && isPlateNumberEmpty && (
                  <p className="text-xs text-red-600 mt-1">
                    Biển số không được trống
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Màu sắc
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  placeholder="Trắng"
                  value={formData.color}
                  onChange={(e) => onFormChange("color", e.target.value)}
                />
                {showErrors && isColorEmpty && (
                  <p className="text-xs text-red-600 mt-1">
                    Màu sắc không được trống
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hãng xe
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  placeholder="Toyota"
                  value={formData.make}
                  onChange={(e) => onFormChange("make", e.target.value)}
                />
                {showErrors && isMakeEmpty && (
                  <p className="text-xs text-red-600 mt-1">
                    Hãng xe không được trống
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dòng xe
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  placeholder="Camry"
                  value={formData.model}
                  onChange={(e) => onFormChange("model", e.target.value)}
                />
                {showErrors && isModelEmpty && (
                  <p className="text-xs text-red-600 mt-1">
                    Dòng xe không được trống
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Loại xe & Dịch vụ */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              Loại xe & Dịch vụ
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((mode) => {
                const selected = selectedModeIds.includes(mode.id);
                const disabled = isModeDisabled(mode.id);

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => !disabled && toggleMode(mode.id)}
                    disabled={disabled}
                    className={`flex flex-col items-center gap-1 px-3 py-3 rounded-lg border-2 transition-all ${
                      disabled
                        ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                        : selected
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
                        className={`text-xs ${selected && !disabled ? "text-blue-600" : "text-gray-500"}`}
                      >
                        {mode.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {showErrors && isNoModeSelected && (
              <p className="text-xs text-red-600 mt-2">
                Vui lòng chọn ít nhất một loại dịch vụ
              </p>
            )}
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
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            Xác nhận thêm
          </button>
        </div>
      </div>
    </div>
  );
}
