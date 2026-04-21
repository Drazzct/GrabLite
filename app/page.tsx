'use client';

import MyButton from '@/components/MyButton';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Trạng thái đóng/mở Modal
  const driverId = 8; // ID cố định theo yêu cầu của bạn

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
    const params = new URLSearchParams({
      driverId: driverId.toString(),
      sortOption: filters.sortOption,
    });

    if (filters.modeType) params.append('modeType', filters.modeType);
    if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);

    fetch(`/api/vehicles?${params.toString()}`)
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(err => console.error("Lỗi:", err));
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
        alert("Thêm xe thành công!");
        setIsOpen(false); // Đóng modal
        fetchVehicles();  // Cập nhật lại danh sách bảng
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi kết nối!");
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
        alert("Đã xóa phương tiện thành công!");
        fetchVehicles(); // Gọi lại hàm lấy dữ liệu để cập nhật bảng
      } else {
        alert(" lỗi khi xóa: " + data.error);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi kết nối khi xóa!");
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
        alert("Đã thay đổi xe đang sử dụng!");
        fetchVehicles(); // Cập nhật lại danh sách để thấy trạng thái ACTIVE mới
      } else {
        alert("Lỗi: " + data.error);
      }
    } catch (error) {
      alert("Lỗi kết nối khi cập nhật!");
    }
  };

  return (
    <div className="p-10 space-y-6 text-gray-800">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-800">Quản lý phương tiện</h1>
        <Link href="/users">
          <button className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-semibold transition-colors border border-blue-200">
            Quản lý người dùng →
          </button>
        </Link>

        <div className="bg-gray-50 p-4 rounded-xl border flex flex-wrap items-end gap-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Loại xe</label>
            <select
              className="border p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-red-500"
              value={filters.modeType}
              onChange={(e) => setFilters({ ...filters, modeType: e.target.value })}
            >
              <option value="">Tất cả</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sức chứa tối thiểu</label>
            <input
              type="number"
              placeholder="VD: 4"
              className="border p-2 rounded-lg w-32 outline-none focus:ring-2 focus:ring-red-500"
              value={filters.minCapacity}
              onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sắp xếp</label>
            <select
              className="border p-2 rounded-lg bg-white outline-none"
              value={filters.sortOption}
              onChange={(e) => setFilters({ ...filters, sortOption: e.target.value })}
            >
              <option value="CAPACITY_DESC">Sức chứa (Giảm dần)</option>
              <option value="CAPACITY_ASC">Sức chứa (Tăng dần)</option>
              <option value="MAKE">Theo hãng xe</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <MyButton action="search" label="Tìm xe" />
          <MyButton action="insert" onClick={() => setIsOpen(true)} />
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b p-3 text-left">Biển số</th>
              <th className="border-b p-3 text-left">Hãng & Dòng xe</th>
              <th className="border-b p-3 text-center">Sức chứa</th>
              <th className="border-b p-3 text-left">Loại xe</th>
              <th className="border-b p-3 text-center">Trạng thái</th>
              <th className="border-b p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v: any) => (
              <tr key={v.VEHICLE_ID} className="hover:bg-gray-50 transition-colors">
                <td className="border-b p-3 font-mono font-bold text-blue-700">{v.PLATE_NUMBER}</td>
                <td className="border-b p-3">{v.MAKE} - {v.MODEL}</td>
                <td className="border-b p-3 text-center">{v.CAPACITY} chỗ</td>
                <td className="border-b p-3">{v.MODE}</td>
                <td className="border-b p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.CURRENT_STATUS === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {v.CURRENT_STATUS}
                  </span>
                </td>
                <td className="border-b p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleSwitch(v.VEHICLE_ID)}
                      className={`text-sm font-medium hover:underline ${v.CURRENT_STATUS === 'ACTIVE' ? 'text-gray-400 cursor-default' : 'text-blue-500'}`}
                      disabled={v.CURRENT_STATUS === 'ACTIVE'}
                    >
                      {v.CURRENT_STATUS === 'ACTIVE' ? 'Đang dùng' : 'Sử dụng'}
                    </button>
                    <button
                      onClick={() => handleDelete(v.VEHICLE_ID)} // Gắn sự kiện xóa
                      className="text-red-500 hover:underline text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM THÊM XE */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Đăng ký xe mới</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biển số (VD: 29A-123.45)</label>
                <input type="text" className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="29A-123.45"
                  onChange={e => setFormData({ ...formData, plateNumber: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hãng xe</label>
                  <input type="text" className="w-full border p-2 rounded-lg" placeholder="Toyota"
                    onChange={e => setFormData({ ...formData, make: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dòng xe</label>
                  <input type="text" className="w-full border p-2 rounded-lg" placeholder="Camry"
                    onChange={e => setFormData({ ...formData, model: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                  <input type="text" className="w-full border p-2 rounded-lg" placeholder="Trắng"
                    onChange={e => setFormData({ ...formData, color: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa</label>
                  <input type="number" className="w-full border p-2 rounded-lg" defaultValue={4}
                    onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Loại xe (Phân cách bằng dấu phẩy)</label>
                <input type="text" className="w-full border p-2 rounded-lg" placeholder="1, 2"
                  onChange={e => setFormData({ ...formData, modeIdsList: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsOpen(false)} className="px-5 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium">
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