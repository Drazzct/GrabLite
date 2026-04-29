import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Vehicle ID is required" },
        { status: 400 },
      );
    }

    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.query(
        `SELECT VC.MODE_ID 
         FROM VEHICLE_CATEGORIZATION VC 
         WHERE VC.VEHICLE_ID = ?
         ORDER BY VC.MODE_ID ASC`,
        [vehicleId],
      );

      const modeIds = rows.map((row: any) => row.MODE_ID.toString());
      return NextResponse.json({ modeIds });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Error fetching vehicle modes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch modes" },
      { status: 500 },
    );
  }
}
