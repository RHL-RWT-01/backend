import React, { useState } from "react";
import { api } from "../utils/api";

interface RegisterProps {
  onLogin: (user: any) => void;
}

export default function Register({ onLogin }: RegisterProps) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onLogin(data.user);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="border w-full p-2 mb-3 rounded"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          className="border w-full p-2 mb-3 rounded"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer">
          Register
        </button>
        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
