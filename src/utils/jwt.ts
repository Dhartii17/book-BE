import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRole } from "../types";

interface TokenPayload {
  sub: string;
  role: UserRole;
}

export const generateToken = (
  userId: string,
  role: UserRole
): string => {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    }
  );
};

export const verifyToken = (
  token: string
): TokenPayload => {
  return jwt.verify(
    token,
    env.jwtSecret
  ) as TokenPayload;
};