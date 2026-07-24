import { connectDB, Employee } from "./server/db.js";
import mongoose from "mongoose";

const list = async () => {
  await connectDB();
  const employees = await Employee.find();
  console.log("Employees in DB:", employees.length);
  employees.forEach(e => console.log(e.name, e.email, e.status, e.id));
  process.exit(0);
};

list();
