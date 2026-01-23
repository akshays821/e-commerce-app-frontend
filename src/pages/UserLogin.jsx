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

import cartImage from "../assets/cart.png";
import { GoogleLogin } from "@react-oauth/google"; // Import Google Login Component

export default function UserLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.userAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { isAuthenticated } = useSelector(
    (state) => state.userAuth
  );

  useEffect(() => {
    dispatch(clearError());
    dispatch(registerSuccess()); // Force loading false on mount
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Handle Successful Google Login
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

      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Google Login failed");
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    dispatch(loginStart());

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
        { email, password }
      );

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

      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed";
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left side */}
      {/* Left side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 relative">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="text-5xl mb-3">🛒</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Shop AI
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Let’s get you shopping
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              Welcome Back
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 outline-none transition border border-border"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 outline-none transition border border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-blue-500"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:scale-105 transition disabled:opacity-60 shadow-lg"
              >
                {loading
                  ? "Logging in..."
                  : isHovered
                    ? "Let’s Go 🚀"
                    : "Login"}
              </button>

              <div className="text-center text-muted-foreground">
                Don’t have an account?{" "}
                <span onClick={() => navigate("/signup")} className="text-blue-600 hover:underline cursor-pointer font-medium">
                  Sign up
                </span>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google Login Failed");
                  }}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  width="100%"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 items-center justify-center">
        <img
          src={cartImage}
          alt="Shopping Cart"
          className="w-[400px] drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
