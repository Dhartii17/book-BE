import { Request } from "express";
export type UserRole = "admin" | "user";
export interface AuthRequest extends Request { user?: { id: string; role: UserRole }; }
