import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/employee-management";

// ==============================
// Connect to MongoDB
// ==============================
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully");

    await seedAdmin();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
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
      enum: ["Active", "Inactive"],
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

export const Employee = mongoose.model("Employee", employeeSchema);

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

export const Admin = mongoose.model("Admin", adminSchema);

// ==============================
// Seed Default Admin
// ==============================
const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({
      username: "admin",
    });

    if (adminExists) return;

    const hashedPassword = await bcrypt.hash("password123", 10);

    await Admin.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
    });

    console.log(`
==========================================
Default Admin Created Successfully

Username : admin
Email    : admin@example.com
Password : password123
==========================================
`);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};