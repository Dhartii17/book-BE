import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { asyncHandler } from "../middleware/asyncHandler";
const router = Router();
router.get("/", asyncHandler(getUsers));
export default router;
