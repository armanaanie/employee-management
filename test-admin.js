import { connectDB, Admin } from "./server/db.js";
const test = async () => {
  await connectDB();
  const admins = await Admin.find();
  console.log("Admins:", admins.map(a => ({ username: a.username, email: a.email })));
  process.exit(0);
};
test();
