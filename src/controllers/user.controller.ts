import { Response } from "express";
import { AuthRequest } from "../types";
import { getUsersService } from "../services/user.service";
export const getUsers = async (req: AuthRequest, res: Response) => {
  const result = await getUsersService(req.query as { page?: string; limit?: string; search?: string });
  res.status(200).json({ success: true, data: result.users, pagination: result.pagination });
};
