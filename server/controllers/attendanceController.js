import { Attendance } from "../models/Attendance.js";
import { Employee } from "../db.js";

const getTodayMidnight = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Clock In
export const clockIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ error: "Employee not found." });

    const today = getTodayMidnight();
    let record = await Attendance.findOne({ employeeId: employee._id, date: today });

    if (record) {
      return res.status(400).json({ error: "Already clocked in today." });
    }

    const now = new Date();
    // Assuming shift starts at 09:30 AM
    const lateThreshold = new Date();
    lateThreshold.setHours(9, 30, 0, 0);

    const status = now > lateThreshold ? "Late" : "Present";

    record = new Attendance({
      employeeId: employee._id,
      date: today,
      clockInTime: now,
      status: status,
    });

    await record.save();
    return res.status(201).json(record);
  } catch (error) {
    console.error("Error during clock in:", error);
    res.status(500).json({ error: "Failed to clock in." });
  }
};

// Clock Out
export const clockOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ error: "Employee not found." });

    const today = getTodayMidnight();
    const record = await Attendance.findOne({ employeeId: employee._id, date: today });

    if (!record) {
      return res.status(400).json({ error: "No clock-in record found for today." });
    }

    if (record.clockOutTime) {
      return res.status(400).json({ error: "Already clocked out today." });
    }

    record.clockOutTime = new Date();
    await record.save();

    return res.status(200).json(record);
  } catch (error) {
    console.error("Error during clock out:", error);
    res.status(500).json({ error: "Failed to clock out." });
  }
};

// Get today's attendance for the logged in employee
export const getTodayAttendance = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) return res.status(404).json({ error: "Employee not found." });

    const today = getTodayMidnight();
    const record = await Attendance.findOne({ employeeId: employee._id, date: today });

    return res.status(200).json(record || null);
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ error: "Failed to fetch today's attendance." });
  }
};

// Get Attendance History
export const getAttendanceHistory = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const records = await Attendance.find()
        .populate("employeeId", "name email department avatar")
        .sort({ date: -1 });
      return res.status(200).json(records);
    } else {
      const employee = await Employee.findOne({ email: req.user.email });
      if (!employee) return res.status(404).json({ error: "Employee not found." });

      const records = await Attendance.find({ employeeId: employee._id })
        .populate("employeeId", "name email department avatar")
        .sort({ date: -1 });
      return res.status(200).json(records);
    }
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    res.status(500).json({ error: "Failed to fetch attendance history." });
  }
};

// Get Attendance Stats for Admin Dashboard
export const getAttendanceStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied." });
    }

    const today = getTodayMidnight();
    const records = await Attendance.find({ date: today });

    const totalEmployees = await Employee.countDocuments({ status: "Active" });
    const present = records.filter((r) => r.status === "Present").length;
    const late = records.filter((r) => r.status === "Late").length;
    // Simple logic: if not clocked in, considered absent
    const absent = totalEmployees - (present + late); 

    res.status(200).json({ present, late, absent });
  } catch (error) {
    console.error("Error fetching attendance stats:", error);
    res.status(500).json({ error: "Failed to fetch attendance stats." });
  }
};
