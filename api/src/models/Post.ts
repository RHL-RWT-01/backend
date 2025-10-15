import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  author: Types.ObjectId;
  value: number;           // left operand (value from previous node / start value)
  operation?: string | null; // "+","-","*","/" or null for start
  rightOperand?: number | null;
  result: number;          // computed result
  parent?: Types.ObjectId | null;
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  value: { type: Number, required: true },
  operation: { type: String, enum: ["+", "-", "*", "/"], default: null },
  rightOperand: { type: Number, default: null },
  result: { type: Number, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Post", default: null }
}, { timestamps: true });

export const Post = model<IPost>("Post", postSchema);
