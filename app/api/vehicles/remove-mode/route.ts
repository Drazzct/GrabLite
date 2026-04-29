import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");
    const modeId = searchParams.get("modeId");

    if (!vehicleId || !modeId) {
      return NextResponse.json(
        { success: false, error: "Vehicle ID and mode ID are required" },
        { status: 400 },
      );
    }

    const connection = await pool.getConnection();
    try {
      await connection.query("CALL REMOVE_VEHICLE_CATEGORIZATION(?, ?)", [
        vehicleId,
        modeId,
      ]);
      return NextResponse.json({
        success: true,
        message: "Mode removed successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error("Error removing vehicle mode:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove mode" },
      { status: 500 },
    );
  }
}
