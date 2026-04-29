import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const { vehicleId, plateNumber } = await request.json();

    if (!vehicleId || !plateNumber) {
      return NextResponse.json(
        { success: false, error: "Vehicle ID and plate number are required" },
        { status: 400 },
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.query("CALL CHANGE_VEHICLE_PLATE(?, ?)", [
        vehicleId,
        plateNumber,
      ]);
      return NextResponse.json({
        success: true,
        message: "Vehicle plate updated successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Error updating vehicle plate:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update plate" },
      { status: 500 },
    );
  }
}
