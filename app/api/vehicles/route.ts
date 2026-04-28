import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // Import từ file vừa tạo

// app/api/vehicles/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");
    const sortOption = searchParams.get("sortOption") || "MAKE";

    // Thêm 5 tham số lọc
    const serviceLevel = searchParams.get("serviceLevel") || null;
    const capacity = searchParams.get("capacity") || null;
    const plateNumber = searchParams.get("plateNumber") || null;
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [rows]: any = await pool.execute(
      "CALL GET_DRIVER_VEHICLE_LIST(?, ?, ?, ?, ?, ?, ?)",
      [
        driverId,
        serviceLevel,
        capacity,
        sortOption,
        plateNumber,
        limit,
        offset,
      ],
    );

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
