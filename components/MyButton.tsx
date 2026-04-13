'use client';

// Định nghĩa các loại thuộc tính mà nút này có thể nhận
interface ButtonProps {
    label: string;            // Chữ hiển thị trên nút
    icon?: string;            // Biểu tượng (không bắt buộc)
    variant: 'primary' | 'danger' | 'success' | 'search'; // Các "kiểu" nút
    onClick?: () => void;     // Hành động khi bấm
}

export default function MyButton({ label, icon, variant, onClick }: ButtonProps) {

    // Xác định màu sắc dựa trên "variant" (biến thể)
    const variantStyles = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        search: 'bg-gray-700 hover:bg-gray-800 text-white',
    };

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 shadow-sm ${variantStyles[variant]}`}
        >
            {icon && <span>{icon}</span>} {/* Hiển thị icon nếu có */}
            {label}
        </button>
    );
}