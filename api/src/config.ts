import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/api_database";
export const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
export const SALT_ROUNDS = process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10;
