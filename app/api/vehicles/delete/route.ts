import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const vehicleId = searchParams.get('vehicleId');

        if (!vehicleId) {
            return NextResponse.json({ error: "Thiếu ID phương tiện" }, { status: 400 });
        }

        // Gọi Procedure DELETE_VEHICLE
        await pool.execute('CALL DELETE_VEHICLE(?)', [vehicleId]);

        return NextResponse.json({ success: true, message: "Xóa thành công" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}