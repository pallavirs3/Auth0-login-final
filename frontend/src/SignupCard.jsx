import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function SignupCard({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await axios.post(`${API}/api/signup`, { email, password });
      setDone(true);
    } catch (e) {
      setErr(e.response?.data?.error || "Signup failed");
    }
  }

  if (done)
    return (
      <div className="w-full max-w-sm bg-[#1f1f1f] text-white p-8 rounded-2xl shadow-2xl text-center space-y-4">
        <h2 className="text-2xl font-bold">🎉 Account Created!</h2>
        <p className="text-sm text-gray-400">
          Check your inbox to verify your email.<br />
          Then log in below.
        </p>
        <button
          onClick={onSwitch}
          className="mt-4 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Go to Login
        </button>
      </div>
    );

  return (
    <div className="w-full max-w-sm bg-[#1f1f1f] text-white p-8 rounded-2xl shadow-2xl space-y-6">
      <h1 className="text-2xl font-bold text-center">Create your account</h1>

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
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button className="underline text-white" onClick={onSwitch}>
          Sign in
        </button>
      </p>
    </div>
  );
}
