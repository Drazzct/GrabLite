'use client';

import MyButton from '@/components/MyButton';

export default function Page() {
  return (
    <div className="p-10 space-y-4">
      <h1 className="text-xl font-bold">Demo các loại nút:</h1>

      {/* Nút Tìm kiếm */}
      <MyButton
        label="Tìm kiếm nhân viên"
        variant="search"
        icon="🔍"
        onClick={() => console.log("Đang tìm...")}
      />

      {/* Nút Thêm */}
      <MyButton
        label="Thêm mới"
        variant="success"
        icon="+"
        onClick={() => alert("Mở form thêm!")}
      />

      {/* Nút Xóa */}
      <MyButton
        label="Xóa dữ liệu"
        variant="danger"
        icon="🗑️"
        onClick={() => confirm("Cậu chắc chứ?")}
      />
    </div>
  );
}