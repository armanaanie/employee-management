import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB, Employee, Admin } from "./db.js";

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// --- Auth Endpoints ---

app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required" });
  }

  try {
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });
    if (existingAdmin) {
      if (existingAdmin.email === email) {
        return res.status(409).json({ error: "Email already exists" });
      }
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: admin._id, username: admin.username, email: admin.email },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res
      .status(201)
      .json({ token, username: admin.username, email: admin.email });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, username, password } = req.body;

  if (!password || (!email && !username)) {
    return res
      .status(400)
      .json({ error: "Email or username and password are required" });
  }

  try {
    const query = email ? { email } : { username };
    const admin = await Admin.findOne(query);
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, email: admin.email },
      JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({ token, username: admin.username, email: admin.email });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// --- Middleware ---

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// --- Protected Employee Endpoints ---

// Get all employees
app.get("/api/employees", authenticate, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Add a new employee
app.post("/api/employees", authenticate, async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ error: "Failed to add employee", details: error.message });
  }
});

// Update an employee
app.put("/api/employees/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// Delete an employee
app.delete("/api/employees/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
