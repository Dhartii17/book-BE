import { UserModel } from "../models/User";
export const getUsersService = async (query: { page?: string; limit?: string; search?: string } = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const search = (query.search || "").trim();
  const filter: any = search ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] } : {};
  const [users, total] = await Promise.all([
    UserModel.find(filter).select("name email role createdAt").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    UserModel.countDocuments(filter),
  ]);
  return { users: users.map((u: any) => ({ id: String(u._id), name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};
