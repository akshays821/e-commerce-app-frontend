import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import {
    loginStart,
    loginSuccess,
    loginFailure,
} from "../redux/slices/userAuthSlice";

import cartImage from "../assets/cart.png";

export default function VerifyEmail() {
    const [otp, setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading } = useSelector((state) => state.userAuth);

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("No email found. Please register first.");
            navigate("/signup");
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!otp) {
            toast.error("Please enter the verification code");
            return;
        }

        dispatch(loginStart());

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/verify-otp`,
                { email, otp }
            );

            dispatch(
                loginSuccess({
                    token: res.data.token,
                    user: res.data.user,
                })
            );

            toast.success("Email verified successfully! Welcome.");
            navigate("/");
        } catch (err) {
            const message = err.response?.data?.message || "Verification failed";
            dispatch(loginFailure(message));
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Left side */}
            <div className="w-full md:w-1/2 bg-background flex flex-col justify-center items-center px-6 py-12 relative">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl opacity-50 animate-pulse" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="mb-10 text-center">
                        <div className="text-5xl mb-3">📧</div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Verify Email
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            We've sent a code to <span className="font-semibold text-foreground">{email}</span>
                        </p>
                    </div>

                    <div className="bg-card rounded-3xl p-8 shadow-xl border border-border">
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2 ml-1">
                                    Enter 6-Digit Code
                                </label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                    className="w-full px-4 py-3 rounded-full bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500 outline-none transition border border-border text-center text-2xl tracking-widest"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:scale-105 transition disabled:opacity-60 shadow-lg"
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 items-center justify-center">
                <div className="text-center text-white p-12">
                    <h2 className="text-4xl font-bold mb-4">Almost There!</h2>
                    <p className="text-xl opacity-90">Verify your email to verify your account and start shopping.</p>
                    <img
                        src={cartImage}
                        alt="Shopping Cart"
                        className="w-[300px] drop-shadow-2xl mx-auto mt-8 opacity-90"
                    />
                </div>
            </div>
        </div>
    );
}
