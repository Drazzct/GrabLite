import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const passengerId = searchParams.get('passengerId');
        const monthsBack = searchParams.get('monthsBack') || '12'; // Mặc định xem 1 năm qua

        if (!passengerId) {
            return NextResponse.json({ error: "Thiếu ID hành khách" }, { status: 400 });
        }

        // Gọi Procedure
        const [rows]: any = await pool.execute(
            'CALL GET_PASSENGER_MONTHLY_REPORT(?, ?)',
            [passengerId, monthsBack]
        );

        // rows[0] chứa danh sách kết quả (Month, Total_Completed_Trips)
        return NextResponse.json(rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}