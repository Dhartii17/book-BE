import { connectDatabase } from "./config/db";
import { UserModel } from "./models/User";
const seed = async () => {
  await connectDatabase();
  const email = (process.env.ADMIN_EMAIL || "admin@books.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin12345!";
  const existing = await UserModel.findOne({ email });
  if (!existing) await UserModel.create({ name: process.env.ADMIN_NAME || "Book Admin", email, password, role: "admin" });
  console.log(`Admin ready: ${email}. Change the default password for non-local use.`);
  process.exit(0);
};
seed().catch((e) => { console.error(e); process.exit(1); });
