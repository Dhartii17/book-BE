import mongoose, { Document, Schema } from "mongoose";
export interface IBook extends Document {
  title: string; author: string; description: string; isbn: string; category: string; publishedYear?: number; createdBy: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date;
}
const bookSchema = new Schema<IBook>({
  title: { type: String, required: true, trim: true, maxlength: 200, index: true },
  author: { type: String, required: true, trim: true, maxlength: 120, index: true },
  description: { type: String, default: "", trim: true, maxlength: 3000 },
  isbn: { type: String, trim: true, default: "", index: true },
  category: { type: String, trim: true, default: "General", maxlength: 80, index: true },
  publishedYear: { type: Number, min: 0, max: 2100 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
}, { timestamps: true });
bookSchema.index({ title: "text", author: "text", description: "text", category: "text" });
export const BookModel = mongoose.model<IBook>("Book", bookSchema);
