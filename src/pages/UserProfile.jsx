
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Shield, MapPin, Save, Grid, Clock, ChevronRight, LogOut, Package, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, updateUser } from "../redux/slices/userAuthSlice";

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.userAuth);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        address: {
            street: "",
            city: "",
            zip: "",
            country: "",
            phone: ""
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, config);
                const defaultAddress = { street: "", city: "", zip: "", country: "", phone: "" };

                setProfileData({
                    name: data.name,
                    email: data.email,
                    address: { ...defaultAddress, ...(data.address || {}) }
                });
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        if (e.target.name.startsWith("addr.")) {
            const field = e.target.name.split(".")[1];
            setProfileData({
                ...profileData,
                address: { ...profileData.address, [field]: e.target.value }
            });
        } else {
            setProfileData({ ...profileData, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const payload = {
                name: profileData.name,
                address: profileData.address
            };

            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, payload, config);

            // Update Redux state with new profile info
            dispatch(updateUser({
                name: profileData.name,
                address: profileData.address
            }));

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    if (loading) return <div className="text-center p-10 font-bold">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-12 md:py-20 px-4 relative font-sans text-slate-900 overflow-hidden">

            {/* Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-4"
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-slate-200/50 border border-white/60 text-center relative overflow-hidden group">

                        {/* Animated gradient mesh background for card */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-slate-900 rounded-full p-1 shadow-2xl shadow-slate-900/30 mb-6">
                                <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-4xl md:text-5xl font-black text-slate-200">
                                    {profileData.name.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{profileData.name}</h2>
                            <p className="text-sm md:text-base text-slate-500 font-medium mb-6">{profileData.email}</p>

                            <div className="flex justify-center gap-2 mb-8">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${user?.role === 'admin'
                                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                                    : 'bg-violet-50 text-violet-600 border-violet-100'}`}>
                                    {user?.role || 'Valued Member'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-5 py-3.5 md:py-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-100 rounded-xl font-bold text-sm transition-all hover:shadow-md">
                                    <Home className="w-5 h-5" /> Go to Home
                                </button>
                                <button className="w-full flex items-center gap-3 px-5 py-3.5 md:py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 transition-transform hover:scale-[1.02]">
                                    <User className="w-5 h-5" /> My Profile
                                </button>
                                <button onClick={() => navigate("/my-orders")} className="w-full flex items-center gap-3 px-5 py-3.5 md:py-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-100 rounded-xl font-bold text-sm transition-all hover:shadow-md">
                                    <Package className="w-5 h-5" /> My Orders
                                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                </button>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3.5 md:py-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold text-sm transition-colors">
                                    <LogOut className="w-5 h-5" /> Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats / Membership */}
                    <div className="mt-6 bg-slate-900 rounded-3xl p-6 text-white text-center shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/10 rounded-full blur-3xl -ml-6 -mb-6" />

                        <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-2">Membership Tier</p>
                        <h3 className="text-2xl font-black mb-1 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">PLATINUM</h3>
                        <p className="text-xs text-slate-400">Exclusive rewards active.</p>
                    </div>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-8 space-y-6"
                >
                    {/* Intro */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-white/60 flex flex-col md:flex-row justify-between items-center md:items-center gap-4 text-center md:text-left">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Account Settings</h1>
                            <p className="text-sm md:text-base text-slate-500 font-medium">Manage your personal details and shipping preferences.</p>
                        </div>
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 border border-violet-100 shadow-sm shrink-0">
                            <Shield className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                        {/* Personal Info */}
                        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 md:p-8 shadow-lg shadow-slate-200/30 border border-slate-100 md:col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 md:mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600"><User className="w-4 h-4" /></span>
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 md:py-3.5 pl-10 text-sm font-bold text-slate-500 cursor-not-allowed"
                                        />
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium pl-1">Email cannot be changed due to security reasons.</p>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 md:p-8 shadow-lg shadow-slate-200/30 border border-slate-100 md:col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 md:mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><MapPin className="w-4 h-4" /></span>
                                Permanent Address (Default)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Street Address</label>
                                    <input
                                        type="text"
                                        name="addr.street"
                                        value={profileData.address.street}
                                        onChange={handleChange}
                                        placeholder="123 Luxury Lane, Penthouse 4"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">City</label>
                                    <input
                                        type="text"
                                        name="addr.city"
                                        value={profileData.address.city}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Postal Code</label>
                                    <input
                                        type="text"
                                        name="addr.zip"
                                        value={profileData.address.zip}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Country</label>
                                    <input
                                        type="text"
                                        name="addr.country"
                                        value={profileData.address.country}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="addr.phone"
                                        value={profileData.address.phone}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="md:col-span-2 flex justify-center md:justify-end pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full md:w-auto justify-center px-10 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;
