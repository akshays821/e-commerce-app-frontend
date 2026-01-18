import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ShieldAlert, Fingerprint, Lock, ChevronRight } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Credentials required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/login`,
        { email, password }
      );

      // Save token for protected admin requests
      localStorage.setItem("adminToken", res.data.token);

      toast.success("Access Granted");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Access Denied"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-['Outfit'] relative overflow-hidden">
      {/* Soft Background Blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden">

          <div className="p-8 pt-10">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                Admin Access
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your credentials to manage the store
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                  Email
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="admin@shopai.com"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg text-gray-400 group-focus-within:text-primary group-focus-within:bg-primary/10 transition-colors">
                    <Fingerprint size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-foreground placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all tracking-widest"
                    placeholder="••••••••"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-gray-50 rounded-lg text-gray-400 group-focus-within:text-primary group-focus-within:bg-primary/10 transition-colors">
                    <Lock size={16} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-sm tracking-wide uppercase shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    Login to Dashboard <ChevronRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
