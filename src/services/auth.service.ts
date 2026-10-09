import { UserModel } from "../models/User";
import { AppError } from "../utils/AppError";
import { generateToken } from "../utils/jwt";

interface RegisterInput { name: string; email: string; password: string; }
interface LoginInput { email: string; password: string; }
const publicUser = (user: any) => ({ id: user._id.toString(), name: user.name, email: user.email, role: user.role });

export const registerUser = async (input: RegisterInput) => {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name || !email || input.password.length < 8) throw new AppError(400, "Name, valid email, and password (at least 8 characters) are required");
  const exists = await UserModel.findOne({ email });
  if (exists) throw new AppError(409, "An account with this email already exists");
  // Public registration can never grant admin privileges.
  const user = await UserModel.create({ name, email, password: input.password, role: "user" });
  return { token: generateToken(user._id.toString(), user.role), user: publicUser(user) };
};

export const loginUser = async (input: LoginInput) => {
  const user = await UserModel.findOne({ email: input.email.trim().toLowerCase() }).select("+password");
  console.log("user--------->", user)
  if (!user || !(await user.comparePassword(input.password))) throw new AppError(401, "Invalid email or password");
  return { token: generateToken(user._id.toString(), user.role), user: publicUser(user) };
};
