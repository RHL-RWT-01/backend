import { useEffect, useState } from "react";
import Home from "./components/Home";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import { api } from "./utils/api";

type User = {
  username: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState("home");

  useEffect(() => {
    api("/auth/me")
      .then(data => setUser(data))
      .catch(() => { });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-3 flex justify-between">
        <span className="font-semibold">CalcChain</span>
        <div className="space-x-3">
          {!user && (
            <>
              <button onClick={() => setPage("login")}>Login</button>
              <button onClick={() => setPage("register")}>Register</button>
            </>
          )}
          {user && (
            <span className="text-sm text-gray-600">
              {user.username}
            </span>
          )}
        </div>
      </nav>

      {page === "home" && <Home user={user} />}
      {page === "login" && <Login onLogin={u => { setUser(u); setPage("home"); }} />}
      {page === "register" && <Register onLogin={u => { setUser(u); setPage("home"); }} />}
    </div>
  );
}
