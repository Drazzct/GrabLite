import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const { vehicleId, color } = await request.json();

    if (!vehicleId || !color) {
      return NextResponse.json(
        { success: false, error: "Vehicle ID and color are required" },
        { status: 400 },
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.query("CALL CHANGE_VEHICLE_COLOR(?, ?)", [
        vehicleId,
        color,
      ]);
      return NextResponse.json({
        success: true,
        message: "Vehicle color updated successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Error updating vehicle color:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update color" },
      { status: 500 },
    );
  }
}
