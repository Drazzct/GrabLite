import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface SignInResult extends RowDataPacket {
  account_id: number;
}

interface UserInfoResult extends RowDataPacket {
  ACCOUNT_ID: number;
  NAME: string;
  EMAIL: string;
  PHONE_NUMBER: string;
  GENDER: string;
  AVATAR: string | null;
  USER_TYPE: string;
  GRABCOINS: number | null;
  DRIVER_LICENSE_GRADE: string | null;
  CURRENT_BALANCE: number | null;
  AVERAGE_RATING: number | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Get database connection
    const connection = await pool.getConnection();

    try {
      // Call the SIGN_IN function to authenticate user

      const [result] = await connection.query<SignInResult[]>(
        "SELECT SIGN_IN(?, ?) as account_id",
        [email, password],
      );

      console.warn("SIGN_IN result:", result);

      const accountId = result[0].account_id;

      // Check if authentication failed
      if (accountId === -1) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      console.warn("User authenticated successfully:", accountId);

      // Get full user information using GET_USER_INFO procedure
      const [userInfo] = await connection.query<UserInfoResult[]>(
        "CALL GET_USER_INFO(?)",
        [accountId],
      );

      if (userInfo.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const user = userInfo[0][0];

      console.warn("User:", user);

      // Return user information
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
          grabcoins: user.GRABCOINS || null,
          driverLicenseGrade: user.DRIVER_LICENSE_GRADE || null,
          currentBalance: user.CURRENT_BALANCE || null,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
