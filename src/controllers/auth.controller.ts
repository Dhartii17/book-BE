import { Request, Response } from "express";
import { AuthRequest } from "../types";
import { loginUser, registerUser } from "../services/auth.service";
import { UserModel } from "../models/User";
import { AppError } from "../utils/AppError";

export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json({ success: true, data: result });
};
export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(200).json({ success: true, data: result });
};
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  const user = await UserModel.findById(req.user?.id).select("name email role createdAt");
  if (!user) throw new AppError(404, "User not found");
  res.status(200).json({ success: true, data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
};
