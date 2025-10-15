import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string; // hashed
}

const userSchema = new Schema<IUser>({
  username: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
}, { timestamps: true });

export const User = model<IUser>("User", userSchema);

