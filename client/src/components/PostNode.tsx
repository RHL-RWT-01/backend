import React, { useState } from "react";
import { api } from "../utils/api";
import { Plus } from "lucide-react";

type PostNodeProps = {
  node: {
    id: number;
    author: { username: string };
    result: number;
    operation?: string;
    value?: number;
    rightOperand?: number;
    children?: any[];
  };
  user?: { username: string } | null;
  refresh: () => void;
};

export default function PostNode({ node, user, refresh }: PostNodeProps) {
  const [showForm, setShowForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [operation, setOperation] = useState("+");
  const [right, setRight] = useState("");

  interface ReplyPayload {
    operation: string;
    rightOperand: number;
  }

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload: ReplyPayload = {
        operation,
        rightOperand: parseFloat(right),
      };
      await api(`/posts/${node.id}/reply`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setShowForm(false);
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReplyClick = () => {
    if (!user) {
      // show login prompt instead of reply form
      setShowLoginPrompt(true);
      return;
    }
    setShowForm((prev) => !prev);
  };

  return (
    <div className="border-l-2 pl-4 mt-3">
      <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
        <p>
          <strong>{node.author.username}</strong> → {node.result}
        </p>

        {node.operation && (
          <p className="text-sm text-gray-600">
            {node.value} {node.operation} {node.rightOperand} = {node.result}
          </p>
        )}

        <div className="flex gap-3 mt-2">
          {/* Reply button always visible */}
          <button
            onClick={handleReplyClick}
            className="text-blue-600 text-sm hover:underline"
          >
            {showForm ? "Cancel" : "Reply"}
          </button>

          {/* Toggle replies (everyone can view) */}
          {node.children && node.children.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-gray-600 text-sm hover:underline"
            >
              {showReplies
                ? `Hide Replies (${node.children.length})`
                : `View Replies (${node.children.length})`}
            </button>
          )}
        </div>

        {/* Reply form (only for logged-in users) */}
        {showForm && user && (
          <form onSubmit={handleReply} className="mt-2">
            <div className="flex gap-2">
              <select
                className="border rounded p-1"
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
              >
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="*">*</option>
                <option value="/">/</option>
              </select>

              <input
                type="number"
                className="border rounded p-1 w-20"
                value={right}
                onChange={(e) => setRight(e.target.value)}
                placeholder="Num"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-2 rounded"
              >
               <Plus size={16} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Replies toggle section */}
      {showReplies && (node.children?.length ?? 0) > 0 && (
        <div className="ml-5 mt-2 border-l-2 border-gray-200 pl-3">
          {(node.children ?? []).map((child) => (
            <PostNode
              key={child.id}
              node={child}
              user={user}
              refresh={refresh}
            />
          ))}
        </div>
      )}

      {/* 🔒 Sign-in popup shown only once when needed */}
      {showLoginPrompt && !user && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-2">
              Sign in required
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              You need to sign in to reply to posts.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <a
                href="/login"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
