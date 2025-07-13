import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function LoginCard({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await axios.post(`${API}/api/login`, { email, password });
      localStorage.setItem("token", data.access_token);
      alert("Logged in!");
    } catch (e) {
      setErr(e.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="w-full max-w-sm bg-[#1f1f1f] text-white p-8 rounded-2xl shadow-2xl space-y-6">
      <h1 className="text-2xl font-bold text-center">Sign in to your account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-[#2a2a2a] border border-[#444] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && <p className="text-sm text-red-400">{err}</p>}

        <button
          type="submit"
          className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-gray-400">
        Don’t have an account?{" "}
        <button className="underline text-white" onClick={onSwitch}>
          Sign up
        </button>
      </p>
    </div>
  );
}
