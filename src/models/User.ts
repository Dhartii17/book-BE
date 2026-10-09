import mongoose, {
  Document,
  Schema,
} from "mongoose";

import bcrypt from "bcryptjs";
import { UserRole } from "../types.js";


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;

  comparePassword(
    password: string
  ): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword =
  async function (
    password: string
  ): Promise<boolean> {
    return bcrypt.compare(
      password,
      this.password
    );
  };

export const UserModel =
  mongoose.model<IUser>(
    "User",
    userSchema
  );