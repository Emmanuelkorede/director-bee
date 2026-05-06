import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);

    const { error } = await login(email, password);

    if (error) {
      setError(error.message);
    }

    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4 font-sans tracking-tight">
      {/* Optional: Simple Logo/Back link */}
      <button 
        onClick={() => navigate("/")}
        className="mb-8 text-[#A89078] hover:text-[#F4EBD0] transition-colors text-sm uppercase tracking-[0.2em] flex items-center gap-2"
      >
        <ArrowLeft size={14} /> Back to Showcase
      </button>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-[#1E1E1E] border border-[#4E342E] rounded-none p-10 space-y-8 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <h1 className="text-[#FFFFFF] text-3xl font-light uppercase tracking-[0.3em]">
            Director
          </h1>
          <div className="h-[1px] w-12 bg-[#4E342E] mx-auto"></div>
          <p className="text-[#A89078] text-[10px] uppercase tracking-[0.2em] pt-2">
            Access Private Dashboard
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="w-full bg-transparent border-b border-[#4E342E] text-[#F4EBD0] py-3 outline-none focus:border-[#F4EBD0] transition-colors placeholder:text-[#4E342E] placeholder:text-xs placeholder:tracking-widest"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full bg-transparent border-b border-[#4E342E] text-[#F4EBD0] py-3 outline-none focus:border-[#F4EBD0] transition-colors placeholder:text-[#4E342E] placeholder:text-xs placeholder:tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-950/20 border border-red-900/50 p-3 text-center">
             <p className="text-red-400 text-[10px] uppercase tracking-wider font-medium">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group relative w-full bg-[#4E342E] text-[#F4EBD0] font-light py-4 uppercase tracking-[0.3em] text-xs transition-all duration-300 hover:bg-[#F4EBD0] hover:text-[#4E342E] disabled:opacity-50"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
               <Loader2 size={16} className="animate-spin" /> Authenticating...
            </span>
          ) : (
            "Enter Workspace"
          )}
        </button>
      </form>
      
      <p className="mt-8 text-[#4E342E] text-[9px] uppercase tracking-widest">
        Property of Rollout Visuals © 2026
      </p>
    </div>
  );
}