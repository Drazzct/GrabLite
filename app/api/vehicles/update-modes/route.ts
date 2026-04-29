import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const { vehicleId, modeIdsList } = await request.json();

    if (!vehicleId || !modeIdsList) {
      return NextResponse.json(
        { success: false, error: "Vehicle ID and mode IDs are required" },
        { status: 400 },
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.query("CALL CHANGE_VEHICLE_MODES(?, ?)", [
        vehicleId,
        modeIdsList,
      ]);
      return NextResponse.json({
        success: true,
        message: "Vehicle modes updated successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Error updating vehicle modes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update modes" },
      { status: 500 },
    );
  }
}
