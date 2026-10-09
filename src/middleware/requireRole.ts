import {
  Response,
  NextFunction,
} from "express";

import { AuthRequest, UserRole } from "../types";

import { AppError } from "../utils/AppError";

export const requireRole =
  (...allowedRoles: UserRole[]) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return next(
        new AppError(
          401,
          "Authentication required"
        )
      );
    }

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return next(
        new AppError(
          403,
          "You do not have permission"
        )
      );
    }

    next();
  };