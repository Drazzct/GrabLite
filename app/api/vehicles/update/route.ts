import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { vehicleId, driverId } = body;

        if (!vehicleId || !driverId) {
            return NextResponse.json({ error: "Thiếu thông tin ID" }, { status: 400 });
        }

        // Gọi Procedure SWITCH_VEHICLE
        // Procedure này sẽ set các xe khác về NULL và set xe này thành ACTIVE
        await pool.execute('CALL SWITCH_VEHICLE(?, ?)', [driverId, vehicleId]);

        return NextResponse.json({ success: true, message: "Đã đổi xe thành công" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}