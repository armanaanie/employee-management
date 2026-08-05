import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  clockIn,
  clockOut,
  getTodayAttendance,
  getAttendanceHistory,
  getAttendanceStats,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/clock-in", authenticate, clockIn);
router.post("/clock-out", authenticate, clockOut);
router.get("/today", authenticate, getTodayAttendance);
router.get("/history", authenticate, getAttendanceHistory);
router.get("/stats", authenticate, getAttendanceStats);

export default router;
