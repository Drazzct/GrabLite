'use client';

// Định nghĩa các loại hành động cụ thể cho dự án
type ButtonAction = 'insert' | 'update' | 'delete' | 'search';

interface ButtonProps {
    action: ButtonAction;
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function MyButton({ action, label, onClick, disabled }: ButtonProps) {

    // Cấu hình giao diện và nội dung mặc định cho từng loại nút
    const config = {
        insert: {
            defaultLabel: 'Thêm mới',
            icon: '➕',
            styles: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
        },
        update: {
            defaultLabel: 'Cập nhật',
            icon: '📝',
            styles: 'bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-500',
        },
        delete: {
            defaultLabel: 'Xóa',
            icon: '🗑️',
            styles: 'bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-500',
        },
        search: {
            defaultLabel: 'Tìm kiếm',
            icon: '🔍',
            styles: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-800',
        },
    };

    const current = config[action];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2.5 rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                ${current.styles} 
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
        >
            <span className="text-sm">{current.icon}</span>
            <span>{label || current.defaultLabel}</span>
        </button>
    );
}