export const formatCurrency = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M đ`;
  }
  return `${Math.round(value / 1_1000)}K đ`;
};

export const formatTime = (timeStr: string) => {
  if (!timeStr) return "Chưa có thông tin";
  const date = new Date(timeStr);

  if (isNaN(date.getTime())) return timeStr;

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const calculateDuration = (
  startTime?: string,
  completionTime?: string,
) => {
  if (!startTime) return "Chưa bắt đầu";
  if (!completionTime) return "Đang di chuyển";

  const start = new Date(startTime).getTime();
  const end = new Date(completionTime).getTime();

  // Kiểm tra nếu dữ liệu ngày tháng không hợp lệ
  if (isNaN(start) || isNaN(end)) return "Không xác định";

  // Tính khoảng cách thời gian bằng phút
  const diffInMinutes = Math.floor(Math.abs(end - start) / (1000 * 60));

  if (diffInMinutes === 0) return "Dưới 1 phút";

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  if (hours > 0) {
    return `${hours} giờ ${minutes > 0 ? `${minutes} phút` : ""}`.trim();
  }
  return `${minutes} phút`;
};
