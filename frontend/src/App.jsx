import { useState } from "react";
import LoginCard from "./LoginCard";
import SignupCard from "./SignupCard";

export default function App() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      {mode === "login" ? (
        <LoginCard onSwitch={() => setMode("signup")} />
      ) : (
        <SignupCard onSwitch={() => setMode("login")} />
      )}
    </div>
  );
}
