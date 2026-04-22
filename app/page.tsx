'use client';

import MyButton from '@/components/MyButton';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Trạng thái đóng/mở Modal
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const driverId = 8; // ID cố định theo yêu cầu của bạn

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 3000);
  };

  // State cho Form thêm xe
  const [formData, setFormData] = useState({
    plateNumber: '',
    make: '',
    model: '',
    color: '',
    capacity: 4,
    modeIdsList: '1' // Mặc định loại xe số 1
  });

  const [filters, setFilters] = useState({
    modeType: '', // 'Bike' hoặc 'Car'
    minCapacity: '',
    sortOption: 'CAPACITY_DESC'
  });

  // Hàm lấy dữ liệu từ API
  // 2. Bọc hàm fetchVehicles bằng useCallback
  const fetchVehicles = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      driverId: driverId.toString(),
      sortOption: filters.sortOption,
    });

    if (filters.modeType) params.append('modeType', filters.modeType);
    if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);

    fetch(`/api/vehicles?${params.toString()}`)
      .then(res => res.json())
      .then(data => { setVehicles(data); setIsLoading(false); })
      .catch(err => { console.error("Lỗi:", err); setIsLoading(false); });
  }, [driverId, filters.modeType, filters.minCapacity, filters.sortOption]); // Dependency của hàm

  // 3. Bây giờ bạn có thể thêm fetchVehicles vào đây mà không lo vòng lặp
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Hàm xử lý gửi form
  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/vehicles/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          registrantId: driverId,
          usingDriverId: null
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Thêm xe thành công!", "success");
        setIsOpen(false); // Đóng modal
        fetchVehicles();  // Cập nhật lại danh sách bảng
      } else {
        showToast("Lỗi: " + data.error, "error");
      }
    } catch (error) {
      showToast("Đã xảy ra lỗi kết nối!", "error");
    }
  };

  // Thêm hàm này vào bên trong function VehiclePage()
  const handleDelete = async (vehicleId: number) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    if (!confirm("Bạn có chắc chắn muốn xóa phương tiện này không?")) return;

    try {
      const res = await fetch(`/api/vehicles/delete?vehicleId=${vehicleId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        showToast("Đã xóa phương tiện thành công!", "success");
        fetchVehicles(); // Gọi lại hàm lấy dữ liệu để cập nhật bảng
      } else {
        showToast("Lỗi khi xóa: " + data.error, "error");
      }
    } catch (error) {
      showToast("Đã xảy ra lỗi kết nối khi xóa!", "error");
    }
  };

  const handleSwitch = async (vehicleId: number) => {
    try {
      const res = await fetch('/api/vehicles/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicleId,
          driverId: driverId // Sử dụng driverId = 8 hiện tại
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Đã thay đổi xe đang sử dụng!", "success");
        fetchVehicles(); // Cập nhật lại danh sách để thấy trạng thái ACTIVE mới
      } else {
        showToast("Lỗi: " + data.error, "error");
      }
    } catch (error) {
      showToast("Lỗi kết nối khi cập nhật!", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 text-gray-800 font-sans relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 font-medium ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? '✅ ' : '❌ '}{toast.message}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-800 tracking-tight">Quản lý phương tiện</h1>
          <p className="text-gray-500 mt-1 text-sm">Quản lý danh sách các phương tiện di chuyển trong hệ thống.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/users">
             <button className="px-4 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 rounded-xl text-sm font-semibold transition-all border border-indigo-200 active:scale-95 flex items-center justify-center">
              👤 Quản lý người dùng
            </button>
          </Link>
          <MyButton action="insert" onClick={() => setIsOpen(true)} />
        </div>
      </div>

      {/* Filters section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-end gap-5">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Loại xe</label>
          <select
            className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            value={filters.modeType}
            onChange={(e) => setFilters({ ...filters, modeType: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sức chứa tối thiểu</label>
          <input
            type="number"
            placeholder="VD: 4"
            className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            value={filters.minCapacity}
            onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sắp xếp theo</label>
          <select
             className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            value={filters.sortOption}
            onChange={(e) => setFilters({ ...filters, sortOption: e.target.value })}
          >
            <option value="CAPACITY_DESC">Sức chứa (Giảm dần)</option>
            <option value="CAPACITY_ASC">Sức chứa (Tăng dần)</option>
            <option value="MAKE">Theo hãng xe</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase font-semibold tracking-wider text-xs">
              <tr>
                <th className="p-4 text-left font-medium">Biển số</th>
                <th className="p-4 text-left font-medium">Hãng & Dòng xe</th>
                <th className="p-4 text-center font-medium">Sức chứa</th>
                <th className="p-4 text-left font-medium">Loại xe</th>
                <th className="p-4 text-center font-medium">Trạng thái</th>
                <th className="p-4 text-center font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                // Skeleton Loading
                [...Array(4)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4"><div className="h-5 bg-gray-100 rounded-md w-24"></div></td>
                    <td className="p-4"><div className="h-5 bg-gray-100 rounded-md w-32"></div></td>
                    <td className="p-4"><div className="h-5 bg-gray-100 rounded-md w-16 mx-auto"></div></td>
                    <td className="p-4"><div className="h-5 bg-gray-100 rounded-md w-20"></div></td>
                    <td className="p-4"><div className="h-6 bg-gray-100 rounded-full w-20 mx-auto"></div></td>
                    <td className="p-4"><div className="h-5 bg-gray-100 rounded-md w-28 mx-auto"></div></td>
                  </tr>
                ))
              ) : vehicles.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-2">🚗</div>
                      <p className="text-lg font-medium text-gray-700">Không tìm thấy phương tiện</p>
                      <p className="text-sm text-gray-400">Hãy thử điều chỉnh bộ lọc hoặc thêm xe mới.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data mapping
                vehicles.map((v: any) => (
                  <tr key={v.VEHICLE_ID} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 font-mono font-semibold text-emerald-700">{v.PLATE_NUMBER}</td>
                    <td className="p-4 font-medium text-gray-700">{v.MAKE} - {v.MODEL}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg px-2.5 py-1 font-medium">
                        {v.CAPACITY} chỗ
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{v.MODE}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${v.CURRENT_STATUS === 'ACTIVE' ? 'bg-emerald-100/80 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {v.CURRENT_STATUS}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleSwitch(v.VEHICLE_ID)}
                          className={`text-sm font-semibold transition-colors focus:outline-none ${v.CURRENT_STATUS === 'ACTIVE' ? 'text-gray-300 cursor-default' : 'text-indigo-600 hover:text-indigo-800 hover:underline'}`}
                          disabled={v.CURRENT_STATUS === 'ACTIVE'}
                        >
                          {v.CURRENT_STATUS === 'ACTIVE' ? 'Đang dùng' : 'Sử dụng'}
                        </button>
                        <button
                          onClick={() => handleDelete(v.VEHICLE_ID)}
                          className="text-rose-500 hover:text-rose-700 hover:underline text-sm font-semibold focus:outline-none transition-colors"
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

      {/* MODAL FORM THÊM XE */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div className="flex justify-between items-center pb-5 mb-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Đăng ký xe mới</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 w-8 h-8 rounded-full flex items-center justify-center text-xl transition-colors focus:outline-none">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Biển số (VD: 29A-123.45)</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 transition-colors focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  placeholder="29A-123.45"
                  onChange={e => setFormData({ ...formData, plateNumber: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hãng xe</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 transition-colors focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500" placeholder="Toyota"
                    onChange={e => setFormData({ ...formData, make: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dòng xe</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 transition-colors focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500" placeholder="Camry"
                    onChange={e => setFormData({ ...formData, model: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Màu sắc</label>
                  <input type="text" className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 transition-colors focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500" placeholder="Trắng"
                    onChange={e => setFormData({ ...formData, color: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sức chứa</label>
                  <input type="number" className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 transition-colors focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500" defaultValue={4}
                    onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ID Loại xe (Phân cách bằng dấu phẩy)</label>
                <input type="text" className="w-full border border-gray-200 p-2.5 rounded-xl bg-gray-50 transition-colors focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500" placeholder="1, 2"
                  onChange={e => setFormData({ ...formData, modeIdsList: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-50">
              <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors focus:outline-none">
                Hủy bỏ
              </button>
              <MyButton action="insert" label="Xác nhận lưu" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}