import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface DriverTripResult extends RowDataPacket {
  TRIP_ID: number;
  STATUS: "PENDING" | "ACCEPTED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  BOOKING_TIME: string;
  FROM_ADDRESS: string;
  TO_ADDRESS: string;
  FINAL_PRICE: number;
  Vehicle_Type: string;
  SERVICE_LEVEL: string;
  Passenger_Name: string;
  RATING_STARS?: number;
  FEEDBACK?: string;
  Completion_Time?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    if (!driverId) {
      return NextResponse.json({ error: "Thiếu ID tài xế" }, { status: 400 });
    }

    // Call GET_DRIVER_TRIP_HISTORY procedure
    const [rows]: any = await pool.execute(
      "CALL GET_DRIVER_TRIP_HISTORY(?, ?, ?)",
      [Number(driverId), Number(limit), Number(offset)],
    );

    // Format the response
    const trips = rows[0].map((trip: DriverTripResult) => ({
      tripId: trip.TRIP_ID,
      status: trip.STATUS,
      bookingTime: trip.BOOKING_TIME,
      fromAddress: trip.FROM_ADDRESS,
      toAddress: trip.TO_ADDRESS,
      finalPrice: trip.FINAL_PRICE,
      vehicleType: trip.Vehicle_Type,
      serviceLevel: trip.SERVICE_LEVEL,
      passengerName: trip.Passenger_Name,
      ratingStars: trip.RATING_STARS || null,
      feedback: trip.FEEDBACK || null,
      completionTime: trip.Completion_Time || null,
      startTime: trip.Start_Time || null,
    }));

    return NextResponse.json(trips);
  } catch (error: any) {
    console.error("Error fetching driver trips:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
