'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export default function UserReportPage() {
    const [reportData, setReportData] = useState([]);
    const passengerId = 1; // Ví dụ ID hành khách
    const [monthsBack, setMonthsBack] = useState(12);

    const fetchReport = useCallback(() => {
        fetch(`/api/passengers?passengerId=${passengerId}&monthsBack=${monthsBack}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReportData(data);
                }
            })
            .catch(err => console.error("Lỗi fetch report:", err));
    }, [passengerId, monthsBack]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    return (
        <div className="p-10 space-y-6 text-gray-800">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-blue-800">Báo cáo hoạt động</h1>
                    <p className="text-gray-500 text-sm">Thống kê chuyến đi hàng tháng của bạn</p>
                </div>
                <Link href="/">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all">
                        ← Quản lý phương tiện
                    </button>
                </Link>
            </div>

            {/* THANH LỌC THỜI GIAN */}
            <div className="bg-white p-4 rounded-xl border flex items-center gap-4 shadow-sm">
                <label className="text-sm font-medium">Xem lại trong:</label>
                <select
                    className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={monthsBack}
                    onChange={(e) => setMonthsBack(Number(e.target.value))}
                >
                    <option value={3}>3 tháng gần nhất</option>
                    <option value={6}>6 tháng gần nhất</option>
                    <option value={12}>12 tháng gần nhất</option>
                    <option value={24}>24 tháng gần nhất</option>
                </select>
            </div>

            {/* HIỂN THỊ BÁO CÁO */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportData.length > 0 ? (
                    reportData.map((item: any) => (
                        <div key={item.Month} className="bg-blue-50 border border-blue-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-blue-600 font-bold text-lg mb-1">{item.Month}</div>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-blue-900">{item.Total_Completed_Trips}</span>
                                <span className="text-blue-700 font-medium mb-1">chuyến đi hoàn thành</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full p-10 text-center bg-gray-50 rounded-xl border border-dashed text-gray-400">
                        Không có dữ liệu chuyến đi trong khoảng thời gian này.
                    </div>
                )}
            </div>
        </div>
    );
}