import { Router } from "express";
import authRoutes from "./auth.routes";
import bookRoutes from "./book.routes";
import userRoutes from "./user.routes";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

const router = Router();
router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/users", authenticate, requireRole("admin"), userRoutes);
router.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
export default router;
