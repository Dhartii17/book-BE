import dotenv from "dotenv";
dotenv.config();
if (!process.env.MONGO_URI) throw new Error("Missing environment variable: MONGO_URI");
if (!process.env.JWT_SECRET) throw new Error("Missing environment variable: JWT_SECRET");
export const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
};
