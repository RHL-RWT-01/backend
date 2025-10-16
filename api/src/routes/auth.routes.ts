import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, SALT_ROUNDS } from "../config";
import { User } from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

/**
 * Register
 * body: { username, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Missing username or password" });

    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: "Username taken" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = (await User.create({
      username,
      password: hash,
      role: "registered",
    })) as typeof User.prototype;

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.json({ user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * Login
 * body: { username, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Missing username or password" });

    const user = (await User.findOne({ username })) as typeof User.prototype & {
      _id: any;
      password: string;
      username: string;
    };
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.json({ user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * me
 */
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const user = await User.findById(userId).select("username");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ id: user._id, username: user.username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});




export default router;

