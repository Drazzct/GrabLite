import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface PassengerTripResult extends RowDataPacket {
  TRIP_ID: number;
  STATUS: "PENDING" | "ACCEPTED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  BOOKING_TIME: string;
  FROM_ADDRESS: string;
  TO_ADDRESS: string;
  FINAL_PRICE: number;
  USED_GRABCOINS: number;
  Vehicle_Type: string;
  SERVICE_LEVEL: string;
  Driver_Name: string;
  RATING_STARS?: number;
  FEEDBACK?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passengerId = searchParams.get("passengerId");
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "0";

    if (!passengerId) {
      return NextResponse.json(
        { error: "Thiếu ID hành khách" },
        { status: 400 },
      );
    }

    // Call GET_PASSENGER_TRIP_HISTORY procedure
    const [rows]: any = await pool.execute(
      "CALL GET_PASSENGER_TRIP_HISTORY(?, ?, ?)",
      [Number(passengerId), Number(limit), Number(offset)],
    );

    // Format the response
    const trips = rows[0].map((trip: PassengerTripResult) => ({
      tripId: trip.TRIP_ID,
      status: trip.STATUS,
      bookingTime: trip.BOOKING_TIME,
      fromAddress: trip.FROM_ADDRESS,
      toAddress: trip.TO_ADDRESS,
      finalPrice: trip.FINAL_PRICE,
      usedGrabcoins: trip.USED_GRABCOINS,
      vehicleType: trip.Vehicle_Type,
      serviceLevel: trip.SERVICE_LEVEL,
      driverName: trip.Driver_Name,
      ratingStars: trip.RATING_STARS || null,
      feedback: trip.FEEDBACK || null,
      startTime: trip.Start_Time || null,
      completionTime: trip.Completion_Time || null,
    }));

    return NextResponse.json(trips);
  } catch (error: any) {
    console.error("Error fetching passenger trips:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
