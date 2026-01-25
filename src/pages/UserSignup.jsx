import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerSuccess,
  clearError,
} from "../redux/slices/userAuthSlice";

import logo from "../assets/logo2.png"; // Changed from cart image to logo
import { GoogleLogin } from "@react-oauth/google";

export default function UserSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.userAuth);

  useEffect(() => {
    dispatch(clearError());
    dispatch(registerSuccess());
  }, [dispatch]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    dispatch(loginStart());

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/register`,
        { name, email, password }
      );

      dispatch(registerSuccess());
      toast.success(res.data.message);
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      const message =
        err.response?.data?.message || "Signup failed";
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      // 1. Send the Google credential (token) to our backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/google`,
        { credential: response.credential }
      );

      // 2. If backend verification works, log the user in
      dispatch(
        loginSuccess({
          token: res.data.token,
          user: {
            _id: res.data._id,
            name: res.data.name,
            email: res.data.email,
          },
        })
      );

      toast.success("Welcome!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Google Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden font-sans">

      {/* Left Column - Form Section - Golden Theme */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-12 relative bg-[#FFFCF2]">

        {/* Rich Golden Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-200/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">

          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-slate-500 text-lg">
              Join us to start your premium journey
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-amber-900/10 border border-amber-200">

            <form onSubmit={handleSignup} className="space-y-5">

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all border border-slate-200 font-medium"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all border border-slate-200 font-medium"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all border border-slate-200 font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-violet-900/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Register Now"
                )}
              </button>


              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                  <span className="bg-white px-4 text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google Login Failed")}
                    useOneTap
                    theme="outline"
                    shape="pill"
                    width="100%"
                  />
                </div>
              </div>
            </form>

            <div className="text-center mt-8 text-slate-500 font-medium">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="text-violet-600 hover:text-violet-700 hover:underline cursor-pointer font-bold">
                Sign In
              </span>
            </div>
          </div>
        </div>

        {/* Footer / Copyright */}
        <div className="absolute bottom-6 text-xs text-slate-400 font-medium">
          © 2024 Shop AI. All Rights Reserved.
        </div>
      </div>

      {/* Right Column - Brand/Visual Section - Violet/Premium Theme */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden bg-slate-900 items-center justify-center">

        {/* Premium Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-slate-900 to-indigo-950" />

        {/* Animated Abstract Shapes */}
        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-violet-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 p-12 text-center flex flex-col items-center">

          {/* Glass Card for Logo */}
          <div className="w-[500px] h-[500px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center p-10 shadow-2xl shadow-violet-900/50 mb-8 relative group">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <img
              src={logo}
              alt="Luxe Logo"
              className="w-full h-full object-contain drop-shadow-2xl opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
              Start Your Collection
            </h2>
            <p className="text-violet-200 text-lg leading-relaxed font-light">
              Create an account today and get exclusive access to our AI-curated selection of premium goods.
            </p>

            {/* Decorative dots */}
            <div className="flex gap-2 justify-center mt-8">
              <div className="w-2 h-2 rounded-full bg-white opacity-100" />
              <div className="w-2 h-2 rounded-full bg-white opacity-40" />
              <div className="w-2 h-2 rounded-full bg-white opacity-40" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
