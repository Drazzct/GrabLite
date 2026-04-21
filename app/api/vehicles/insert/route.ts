import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { plateNumber, make, model, color, capacity, registrantId, usingDriverId, modeIdsList } = body;

        // 1. Khai báo biến session để nhận giá trị OUT
        // 2. Gọi Procedure
        // 3. Select biến session đó để lấy ID vừa tạo
        const sql = `
      CALL INSERT_VEHICLE(?, ?, ?, ?, ?, ?, ?, ?, @out_id);
      SELECT @out_id AS new_vehicle_id;
    `;

        const [result]: any = await pool.query(sql, [
            plateNumber, make, model, color, capacity, registrantId, usingDriverId, modeIdsList
        ]);

        // result[1][0] chứa giá trị từ lệnh SELECT @out_id
        const newId = result[1][0].new_vehicle_id;

        return NextResponse.json({ success: true, vehicleId: newId });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}