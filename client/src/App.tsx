import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import { api } from "./utils/api";

type User = {
  username: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/auth/me")
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-3 flex justify-between">
          <Link to="/" className="font-semibold">CalcChain</Link>

          <div className="space-x-3">
            {!user ? (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </>
            ) : (
              <span className="text-sm text-gray-600">{user.username}</span>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={u => setUser(u)} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Register onLogin={u => setUser(u)} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
