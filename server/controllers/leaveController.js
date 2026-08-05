import { Leave } from "../models/Leave.js";
import { Employee } from "../db.js";

// Apply for a new leave (Employee)
export const applyLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    
    // The user id from the token is the Admin id. 
    // We need to find the corresponding Employee document.
    const employeeEmail = req.user.email;
    const employee = await Employee.findOne({ email: employeeEmail });
    
    if (!employee) {
      return res.status(404).json({ error: "Employee profile not found." });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      type,
      startDate,
      endDate,
      reason,
      status: "Pending"
    });

    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({ error: "Failed to apply for leave." });
  }
};

// Get leaves (Admin gets all, Employee gets their own)
export const getLeaves = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const leaves = await Leave.find()
        .populate("employeeId", "name email department avatar")
        .sort({ appliedOn: -1 });
      return res.json(leaves);
    } else {
      const employee = await Employee.findOne({ email: req.user.email });
      if (!employee) {
        return res.status(404).json({ error: "Employee not found." });
      }
      const leaves = await Leave.find({ employeeId: employee._id })
        .populate("employeeId", "name email department avatar")
        .sort({ appliedOn: -1 });
      return res.json(leaves);
    }
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ error: "Failed to fetch leaves." });
  }
};

// Update leave status (Admin only)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden. Admin access required." });
    }

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("employeeId", "name email department avatar");

    if (!updatedLeave) {
      return res.status(404).json({ error: "Leave record not found." });
    }

    res.json(updatedLeave);
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ error: "Failed to update leave status." });
  }
};

// Get leave statistics (Admin only)
export const getLeaveStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden. Admin access required." });
    }

    const total = await Leave.countDocuments();
    const pending = await Leave.countDocuments({ status: "Pending" });
    const approved = await Leave.countDocuments({ status: "Approved" });
    const rejected = await Leave.countDocuments({ status: "Rejected" });

    res.json({ total, pending, approved, rejected });
  } catch (error) {
    console.error("Error fetching leave stats:", error);
    res.status(500).json({ error: "Failed to fetch leave statistics." });
  }
};
