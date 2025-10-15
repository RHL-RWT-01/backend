import { Router } from "express";
import { calculateResult } from "../utils/calculate";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Types } from "mongoose";
import { Post } from "../models/Post";

const router = Router();

/**
 * GET /api/posts
 * Returns all posts as a nested tree (roots first). We build the tree on the server.
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all posts with author username
    const posts = await Post.find().populate("author", "username").sort({ createdAt: 1 }).lean();
    // Build map
    const map = new Map<string, any>();
    for (const p of posts) {
      map.set(p._id.toString(), { ...p, id: p._id.toString(), children: [] });
    }
    // Attach children
    const roots: any[] = [];
    for (const [id, node] of map.entries()) {
      if (node.parent) {
        const parentId = node.parent.toString();
        const parent = map.get(parentId);
        if (parent) parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return res.json({ nodes: roots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/posts
 * Create starting number (root)
 * body: { value: number }
 * Auth required
 */
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { value } = req.body;
    

    // For a start node: value and result are same
    const post = await Post.create({
      author: Types.ObjectId.createFromHexString(userId),
      value,
      operation: null,
      rightOperand: null,
      result: value,
      parent: null
    });
    const populated = await post.populate("author", "username");
    return res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/posts/:parentId/reply
 * Add an operation to an existing post.
 * body: { operation: "+|-|*|/", rightOperand: number }
 * Auth required
 */
router.post("/:parentId/reply", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { parentId } = req.params;
    const { operation, rightOperand } = req.body;

    if (!["+", "-", "*", "/"].includes(operation)) return res.status(400).json({ error: "Invalid operation" });
    if (typeof rightOperand !== "number") return res.status(400).json({ error: "Invalid rightOperand" });

    const parent = await Post.findById(parentId);
    if (!parent) return res.status(404).json({ error: "Parent not found" });

    // Calculate server-side
    let result: number;
    try {
      result = calculateResult(parent.result, operation, rightOperand);
    } catch (e: any) {
      if (e.message === "DivisionByZero") return res.status(400).json({ error: "Division by zero" });
      return res.status(400).json({ error: "Invalid operation" });
    }

    const post = await Post.create({
      author: Types.ObjectId.createFromHexString(userId),
      value: parent.result,
      operation,
      rightOperand,
      result,
      parent: parent._id
    });

    const populated = await post.populate("author", "username");
    return res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
