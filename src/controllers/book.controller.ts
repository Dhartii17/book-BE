import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../types";
import { BookModel } from "../models/Book";
import { AppError } from "../utils/AppError";

const cleanInput = (body: any) => ({
  title: String(body.title ?? "").trim(),
  author: String(body.author ?? "").trim(),
  description: String(body.description ?? "").trim(),
  isbn: String(body.isbn ?? "").trim(),
  category: String(body.category ?? "General").trim() || "General",
  ...(body.publishedYear !== undefined && body.publishedYear !== "" ? { publishedYear: Number(body.publishedYear) } : {}),
});
const validateBook = (input: ReturnType<typeof cleanInput>) => {
  if (!input.title || !input.author) throw new AppError(400, "Title and author are required");
  if (input.title.length > 200 || input.author.length > 120 || input.description.length > 3000) throw new AppError(400, "One or more fields exceed the allowed length");
  if (input.publishedYear !== undefined && (!Number.isInteger(input.publishedYear) || input.publishedYear < 0 || input.publishedYear > new Date().getFullYear() + 1)) throw new AppError(400, "Published year is invalid");
};
export const listBooks = async (req: AuthRequest, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const search = String(req.query.search ?? "").trim();
  const filter: any = search ? { $or: [
    { title: { $regex: escapeRegex(search), $options: "i" } }, { author: { $regex: escapeRegex(search), $options: "i" } },
    { category: { $regex: escapeRegex(search), $options: "i" } }, { isbn: { $regex: escapeRegex(search), $options: "i" } },
  ] } : {};
  const [books, total] = await Promise.all([
    BookModel.find(filter).populate("createdBy", "name email").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    BookModel.countDocuments(filter),
  ]);
  res.json({ success: true, data: books, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
};
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const getBook = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError(400, "Invalid book ID");
  const book = await BookModel.findById(req.params.id).populate("createdBy", "name email");
  if (!book) throw new AppError(404, "Book not found");
  res.json({ success: true, data: book });
};
export const createBook = async (req: AuthRequest, res: Response) => {
  const input = cleanInput(req.body); validateBook(input);
  const book = await BookModel.create({ ...input, createdBy: req.user!.id });
  const result = await book.populate("createdBy", "name email");
  res.status(201).json({ success: true, data: result });
};
export const updateBook = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError(400, "Invalid book ID");
  const book = await BookModel.findById(req.params.id);
  if (!book) throw new AppError(404, "Book not found");
  const isAdmin = req.user!.role === "admin";
  if (!isAdmin && book.createdBy.toString() !== req.user!.id) throw new AppError(403, "You can only update books you created");
  const input = cleanInput(req.body); validateBook(input);
  Object.assign(book, input); await book.save(); await book.populate("createdBy", "name email");
  res.json({ success: true, data: book });
};
export const deleteBook = async (req: AuthRequest, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError(400, "Invalid book ID");
  const book = await BookModel.findById(req.params.id);
  if (!book) throw new AppError(404, "Book not found");
  if (req.user!.role !== "admin" && book.createdBy.toString() !== req.user!.id) throw new AppError(403, "You can only delete books you created");
  await book.deleteOne(); res.json({ success: true, message: "Book deleted" });
};
