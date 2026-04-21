'use client';

// Định nghĩa các loại hành động cụ thể cho dự án
type ButtonAction = 'insert' | 'update' | 'delete' | 'search';

interface ButtonProps {
    action: ButtonAction;      // Thay 'variant' bằng 'action' để mang tính nghiệp vụ hơn
    label?: string;            // Có thể truyền label riêng, nếu không sẽ dùng mặc định
    onClick?: () => void;
    disabled?: boolean;        // Thêm trạng thái disabled khi đang xử lý
}

export default function MyButton({ action, label, onClick, disabled }: ButtonProps) {

    // Cấu hình giao diện và nội dung mặc định cho từng loại nút
    const config = {
        insert: {
            defaultLabel: 'Thêm mới',
            icon: '➕',
            styles: 'bg-green-600 hover:bg-green-700 text-white',
        },
        update: {
            defaultLabel: 'Cập nhật',
            icon: '📝',
            styles: 'bg-blue-500 hover:bg-blue-600 text-white',
        },
        delete: {
            defaultLabel: 'Xóa',
            icon: '🗑️',
            styles: 'bg-red-500 hover:bg-red-600 text-white',
        },
        search: {
            defaultLabel: 'Tìm kiếm',
            icon: '🔍',
            styles: 'bg-gray-700 hover:bg-gray-800 text-white',
        },
    };

    const current = config[action];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 shadow-sm 
                ${current.styles} 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
        >
            <span>{current.icon}</span>
            {label || current.defaultLabel}
        </button>
    );
}