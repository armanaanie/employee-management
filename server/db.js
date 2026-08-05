import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  dotenv.config();
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/employee-management";

let connectPromise = null;

// ==============================
// Connect to MongoDB
// ==============================
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    if (connectPromise) return connectPromise;
  }

  console.log("Connecting to MongoDB at", MONGODB_URI);

  connectPromise = mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log("✅ MongoDB connected successfully");
      await seedAdmin();
    })
    .catch((error) => {
      console.error("❌ MongoDB connection failed:", error);
      connectPromise = null;
      throw error;
    });

  return connectPromise;
};

// ==============================
// Employee Schema
// ==============================
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["Active", "On Leave", "Terminated"],
      default: "Active",
    },

    joinDate: {
      type: Date,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
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
  },
);

export const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

// ==============================
// Admin Schema
// ==============================
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    avatar: {
      type: String,
      default: "",
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
  },
);

export const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

// ==============================
// Seed Default Admin
// ==============================
const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({
      $or: [{ username: "admin" }, { email: "admin@gmail.com" }],
    });

    if (existingAdmin) {
      const needsUpdate =
        existingAdmin.role !== "admin" ||
        existingAdmin.username !== "admin" ||
        existingAdmin.email !== "admin@gmail.com";

      if (needsUpdate) {
        existingAdmin.username = "admin";
        existingAdmin.email = "admin@gmail.com";
        existingAdmin.role = "admin";
        await existingAdmin.save();
      }
      return;
    }

    const hashedPassword = await bcrypt.hash("Password123!", 10);

    await Admin.create({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log(`
==========================================
Default Admin Created Successfully

Username : admin
Email    : admin@gmail.com
Password : Password123!
==========================================
`);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};
