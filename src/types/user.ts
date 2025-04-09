export interface User {
  _id: string;
  username: string;
  password: string;
  fullName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: Date;
  avatar?: string;
  coverPhoto?: string;
  rank: "Bronze" | "Silver" | "Gold"; // Các cấp bậc
  role: "user" | "admin"; // Phân quyền
  createdAt?: Date;
  updatedAt?: Date;
}
