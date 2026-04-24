import mysql from "mysql2/promise";

// Tạo một pool kết nối để tối ưu hiệu suất (không cần đóng/mở thủ công liên tục)
export const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Thay bằng user của bạn
  database: process.env?.DB_NAME || "GRAB",
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0,
  password: process.env?.DB_PASSWORD || undefined,
});
