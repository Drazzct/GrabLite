'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export default function UserReportPage() {
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const passengerId = 1; // Ví dụ ID hành khách
    const [monthsBack, setMonthsBack] = useState(12);

    const fetchReport = useCallback(() => {
        setIsLoading(true);
        fetch(`/api/passengers?passengerId=${passengerId}&monthsBack=${monthsBack}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setReportData(data);
                } else {
                    setReportData([]);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Lỗi fetch report:", err);
                setIsLoading(false);
            });
    }, [passengerId, monthsBack]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 text-gray-800 font-sans relative">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-emerald-800 tracking-tight">Báo cáo hoạt động</h1>
                    <p className="text-gray-500 mt-1 text-sm">Thống kê chuyến đi hàng tháng của bạn</p>
                </div>
                <Link href="/">
                    <button className="px-4 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 rounded-xl text-sm font-semibold transition-all border border-indigo-200 active:scale-95 flex items-center justify-center">
                        ← Quản lý phương tiện
                    </button>
                </Link>
            </div>

            {/* THANH LỌC THỜI GIAN */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-5">
                <label className="text-sm font-semibold text-gray-700">Xem lại trong khoảng thời gian:</label>
                <select
                    className="w-48 border border-gray-200 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100/50 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {isLoading ? (
                    // Skeleton Loading
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <div className="h-6 bg-gray-200 w-24 rounded-md mb-4"></div>
                            <div className="flex items-end gap-2">
                                <div className="h-10 bg-gray-200 w-12 rounded-lg"></div>
                                <div className="h-4 bg-gray-200 w-32 rounded-md mb-2"></div>
                            </div>
                        </div>
                    ))
                ) : reportData.length > 0 ? (
                    reportData.map((item: any) => (
                        <div key={item.Month} className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                            <div className="text-emerald-700 font-bold text-lg mb-1 group-hover:text-emerald-800 transition-colors">{item.Month}</div>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-emerald-900">{item.Total_Completed_Trips}</span>
                                <span className="text-emerald-700 font-medium mb-1.5 opacity-80">chuyến đi</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-2">📅</div>
                            <p className="text-lg font-medium text-gray-700">Không có dữ liệu chuyến đi</p>
                            <p className="text-sm text-gray-400">Chưa có chuyến đi nào được hoàn thành trong khoảng thời gian này.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}