import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/userAuthSlice";

import cartImage from "../assets/cart.png";

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
  if (isAuthenticated) {
    navigate("/");
  }
}, [isAuthenticated, navigate]);


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
      <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col justify-center items-center px-6 py-12 relative">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse" />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="text-5xl mb-3">🛒</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Shop AI
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Let’s get you shopping
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700/50">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Welcome Back
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-full font-semibold hover:scale-105 transition disabled:opacity-60"
              >
                {loading
                  ? "Logging in..."
                  : isHovered
                  ? "Let’s Go 🚀"
                  : "Login"}
              </button>

              <div className="text-center text-gray-400">
                Don’t have an account?{" "}
                <span className="text-blue-400 hover:underline cursor-pointer">
                  Sign up
                </span>
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
