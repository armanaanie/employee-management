import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    clockInTime: {
      type: Date,
      required: true,
    },
    clockOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Present", "Late", "Absent"],
      default: "Present",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

// Compound index to ensure one attendance record per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
