import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { verifyToken } from "../utils/jwt";
import { UserModel } from "../models/User";
import { AppError } from "../utils/AppError";
export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new AppError(401, "Authentication required");
    const payload = verifyToken(header.slice(7));
    if (!payload.sub) throw new AppError(401, "Invalid token");
    const user = await UserModel.findById(payload.sub).select("role");
    if (!user) throw new AppError(401, "User no longer exists");
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) { next(error); }
};
