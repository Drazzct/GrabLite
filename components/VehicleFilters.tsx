import { Search, Filter, Zap, ArrowDownUp } from "lucide-react";

interface FilterState {
  serviceLevel: string;
  capacity: string;
  sortOption: string;
  plateNumber: string;
}

interface VehicleFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function VehicleFilters({
  filters,
  onFiltersChange,
}: VehicleFiltersProps) {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tìm kiếm biển số xe
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="VD: 29A-123"
              className="w-full border border-gray-200 p-2.5 pl-10 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              value={filters.plateNumber}
              onChange={(e) =>
                handleFilterChange("plateNumber", e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Loại dịch vụ
          </label>
          <div className="relative">
            <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              className="w-full border border-gray-200 p-2.5 pl-10 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none"
              value={filters.serviceLevel}
              onChange={(e) =>
                handleFilterChange("serviceLevel", e.target.value)
              }
            >
              <option value="">Tất cả</option>
              <option value="Standard">Tiêu chuẩn</option>
              <option value="Saver">Tiết kiệm</option>
              <option value="Electric">Xe điện</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Loại xe
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              className="w-full border border-gray-200 p-2.5 pl-10 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none"
              value={filters.capacity}
              onChange={(e) => handleFilterChange("capacity", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="2">Xe máy</option>
              <option value="5">Xe ô tô 5 chỗ</option>
              <option value="7">Xe ô tô 7 chỗ</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <div className="relative">
            <ArrowDownUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              className="w-full border border-gray-200 p-2.5 pl-10 rounded-lg bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none"
              value={filters.sortOption}
              onChange={(e) => handleFilterChange("sortOption", e.target.value)}
            >
              <option value="CAPACITY_DESC">Sức chứa (Giảm dần)</option>
              <option value="CAPACITY_ASC">Sức chứa (Tăng dần)</option>
              <option value="MAKE">Theo hãng xe</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
