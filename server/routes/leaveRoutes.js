import express from "express";
import { applyLeave, getLeaves, updateLeaveStatus, getLeaveStats } from "../controllers/leaveController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, applyLeave);
router.get("/", authenticate, getLeaves);
router.get("/stats", authenticate, getLeaveStats);
router.put("/:id/status", authenticate, updateLeaveStatus);

export default router;
