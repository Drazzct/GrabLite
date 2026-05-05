import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface SignUpResponse extends RowDataPacket {
  account_id: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phoneNumber,
      email,
      password,
      gender,
      userType,
      driverLicenseGrade,
    } = body;

    // Validate required fields
    if (!name || !phoneNumber || !email || !password || !userType) {
      return NextResponse.json(
        {
          error:
            "Name, phone number, email, password, and user type are required",
        },
        { status: 400 },
      );
    }

    // Validate user type
    if (!["Passenger", "Driver"].includes(userType)) {
      return NextResponse.json(
        { error: "User type must be either 'Passenger' or 'Driver'" },
        { status: 400 },
      );
    }

    // Validate driver license grade if driver
    if (
      userType === "Driver" &&
      !["A1", "A2", "B2", "C", "D", "E", "F"].includes(driverLicenseGrade)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid driver license grade. Must be one of: A1, A2, B2, C, D, E, F",
        },
        { status: 400 },
      );
    }

    // Get database connection
    const connection = await pool.getConnection();

    try {
      // Call the appropriate sign-up procedure
      if (userType === "Passenger") {
        const [result] = await connection.query<SignUpResponse[]>(
          "CALL SIGN_UP_PASSENGER(?, ?, ?, ?, ?, @account_id); SELECT @account_id as account_id;",
          [name, phoneNumber, email, password, gender || "Male"],
        );

        // Get the account_id from the result set (last query result)
        const accountId = result[result.length - 1][0]?.account_id;

        if (accountId === -1) {
          return NextResponse.json(
            {
              error: "Sign up failed. Email or phone number may already exist.",
            },
            { status: 400 },
          );
        }

        if (!accountId) {
          return NextResponse.json(
            { error: "Failed to create passenger account" },
            { status: 500 },
          );
        }

        // Get user information using GET_USER_INFO procedure
        const [userInfo] = await connection.query<RowDataPacket[]>(
          "CALL GET_USER_INFO(?)",
          [accountId],
        );

        const user = userInfo[0][0];

        return NextResponse.json({
          success: true,
          user: {
            id: user.ACCOUNT_ID,
            name: user.NAME,
            email: user.EMAIL,
            phone: user.PHONE_NUMBER,
            gender: user.GENDER,
            avatar: user.AVATAR,
            userType: user.USER_TYPE,
            averageRating: user.AVERAGE_RATING || null,
            grabCoins: user.GRABCOINS || 0,
          },
        });
      } else {
        // Driver sign-up
        const [result] = await connection.query<SignUpResponse[]>(
          "CALL SIGN_UP_DRIVER(?, ?, ?, ?, ?, ?, @account_id); SELECT @account_id as account_id;",
          [
            name,
            phoneNumber,
            email,
            password,
            gender || "Male",
            driverLicenseGrade,
          ],
        );

        // Get the account_id from the result set (last query result)
        const accountId = result[result.length - 1][0]?.account_id;

        if (accountId === -1) {
          return NextResponse.json(
            {
              error: "Sign up failed. Email or phone number may already exist.",
            },
            { status: 400 },
          );
        }

        if (!accountId) {
          return NextResponse.json(
            { error: "Failed to create driver account" },
            { status: 500 },
          );
        }

        // Get user information using GET_USER_INFO procedure
        const [userInfo] = await connection.query<RowDataPacket[]>(
          "CALL GET_USER_INFO(?)",
          [accountId],
        );

        const user = userInfo[0][0];

        return NextResponse.json({
          success: true,
          user: {
            id: user.ACCOUNT_ID,
            name: user.NAME,
            email: user.EMAIL,
            phone: user.PHONE_NUMBER,
            gender: user.GENDER,
            avatar: user.AVATAR,
            userType: user.USER_TYPE,
            averageRating: user.AVERAGE_RATING || null,
            driverLicenseGrade: user.DRIVER_LICENSE_GRADE,
            currentBalance: user.CURRENT_BALANCE || 0,
          },
        });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
