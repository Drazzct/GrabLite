import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, modeId } = await request.json();

    if (!vehicleId || !modeId) {
      return NextResponse.json(
        { success: false, error: "Vehicle ID and mode ID are required" },
        { status: 400 },
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.query("CALL ADD_VEHICLE_CATEGORIZATION(?, ?)", [
        vehicleId,
        modeId,
      ]);
      return NextResponse.json({
        success: true,
        message: "Mode added successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Error adding vehicle mode:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add mode" },
      { status: 500 },
    );
  }
}
