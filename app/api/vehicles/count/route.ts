import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");
    const serviceLevel = searchParams.get("serviceLevel") || null;
    const capacity = searchParams.get("capacity") || null;
    const plateNumber = searchParams.get("plateNumber") || null;

    const [rows]: any = await pool.execute(
      "CALL COUNT_DRIVER_VEHICLES(?, ?, ?, ?)",
      [driverId, serviceLevel, capacity, plateNumber],
    );

    const totalCount = rows[0][0]?.total_count || 0;

    return NextResponse.json({ total_count: totalCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
