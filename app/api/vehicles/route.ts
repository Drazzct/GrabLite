import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Import từ file vừa tạo

// app/api/vehicles/route.ts
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const driverId = searchParams.get('driverId');
        const sortOption = searchParams.get('sortOption') || 'MAKE';

        // Thêm 2 tham số lọc mới
        const modeType = searchParams.get('modeType') || null;
        const minCapacity = searchParams.get('minCapacity') || null;

        const [rows]: any = await pool.execute(
            'CALL GET_DRIVER_VEHICLE_LIST(?, ?, ?, ?)',
            [driverId, modeType, minCapacity, sortOption]
        );

        return NextResponse.json(rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}