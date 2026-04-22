<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

# 🚀 WORKFLOW: REDESIGN UI FOR GRAB-VEHICLE PROJECT

## 1. PHÂN TÍCH & KIỂM TOÁN (AUDIT)
* **Mục tiêu:** Hiểu cấu trúc hiện tại.
* **Nhiệm vụ của Agent:**
    * Đọc file `page.tsx` để xác định các thành phần chính: Table, Modal, Filter Bar.
    * Kiểm tra component `MyButton.tsx` để xem các biến thể màu sắc và icon.
    * Xác định bảng màu chủ đạo (hiện tại đang dùng `red-800` cho tiêu đề và các màu cơ bản cho nút).

## 2. THIẾT LẬP HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM)
* **Mục tiêu:** Tạo sự nhất quán.
* **Nhiệm vụ của Agent:**
    * **Bảng màu (Palette):** Đề xuất bộ màu chuyên nghiệp hơn (ví dụ: Primary là `Emerald-600` cho giống phong cách Grab, hoặc `Indigo-600` cho hệ thống quản lý).
    * **Typography:** Sử dụng font chữ không chân (Sans-serif) hiện đại như `Inter` hoặc `Roboto`.
    * **Spacing & Radius:** Thống nhất khoảng cách (padding/margin) và độ bo góc (thường là `rounded-xl` hoặc `rounded-2xl`).

## 3. THIẾT KẾ LẠI CÁC THÀNH PHẦN (COMPONENTS)
* **Mục tiêu:** Nâng cấp thẩm mỹ và trải nghiệm.
* **Nhiệm vụ của Agent:**
    * **Data Table:** Chuyển từ bảng kẻ ô truyền thống sang dạng bảng "vô cực" với đường kẻ mờ, có hiệu ứng hover dòng và phân tách màu nền đầu trang.
    * **Filters:** Gộp các ô lọc vào một Card trắng có đổ bóng nhẹ (shadow-sm) để tách biệt với nền trang.
    * **Modal:** Cập nhật hiệu ứng Blur nền (`backdrop-blur-md`) và hoạt ảnh hiện ra (`animate-in fade-in slide-in-from-bottom-4`).
    * **Buttons:** Tối ưu `MyButton` với hiệu ứng `ring` khi focus và `active:scale-95` khi click.

## 4. TỐI ƯU HÓA TRẢI NGHIỆM (UX & LAYOUT)
* **Mục tiêu:** Dễ sử dụng trên mọi thiết bị.
* **Nhiệm vụ của Agent:**
    * **Responsive:** Đảm bảo Table có thể cuộn ngang trên điện thoại (`overflow-x-auto`).
    * **Empty State:** Thiết kế hình ảnh/icon minh họa khi bảng không có dữ liệu.
    * **Loading State:** Thêm hiệu ứng Skeleton (khung xương) trong lúc chờ `fetchVehicles` hoặc `fetchReport`.

## 5. THỰC THI & KIỂM TRA (IMPLEMENTATION)
* **Mục tiêu:** Chuyển đổi thiết kế thành code.
* **Nhiệm vụ của Agent:**
    * Cập nhật trực tiếp vào file `page.tsx`.
    * Kiểm tra các Route API (`/api/vehicles`, `/api/passenger`) để đảm bảo UI mới hiển thị đúng dữ liệu.
    * Xác nhận các thông báo lỗi (Error handling) hiển thị tinh tế dưới dạng Toast thay vì `alert()` thô sơ.

<!-- END:nextjs-agent-rules -->
