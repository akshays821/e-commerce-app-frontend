import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Lock } from "lucide-react";
import logo from "../assets/logo2.png";

import AdminDemoModal from "./AdminDemoModal";

export default function Footer() {
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

    return (
        <>
            <AdminDemoModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
            />

            <footer className="bg-[#1c1c1c] border-t border-white/[0.08] pt-16 pb-8 md:pt-20 md:pb-12 relative z-50 overflow-hidden">

                {/* Subtle Background Pattern - extremely low opacity */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">

                        {/* Column 1: Brand */}
                        <div className="space-y-6">
                            <Link to="/" className="block">
                                <img
                                    src={logo}
                                    alt="ShopAI"
                                    className="h-24 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </Link>
                            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                               Smart Shopping , Powered By AI
                            </p>
                        </div>

                        {/* Column 2: Navigation */}
                        <div className="pt-2">
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/" className="text-neutral-500 hover:text-indigo-400 transition-colors text-sm font-medium">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <a href="#products-section" className="text-neutral-500 hover:text-indigo-400 transition-colors text-sm font-medium">
                                        Products
                                    </a>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setIsAdminModalOpen(true)}
                                        className="text-neutral-500 hover:text-indigo-400 transition-colors text-sm font-medium text-left"
                                    >
                                        Admin Login
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Developer */}
                        <div className="pt-2">
                            <ul className="space-y-4">
                                <li>
                                    <a href="https://github.com/akshays821" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-500 hover:text-indigo-400 transition-colors text-sm font-medium">
                                        <Github size={18} /> GitHub Repository
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/in/akshay-shaji-418385361?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-500 hover:text-indigo-400 transition-colors text-sm font-medium">
                                        <Linkedin size={18} /> LinkedIn Profile
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:akshayshaji821@gmail.com?subject=ShopAI%20Project%20Inquiry&body=Hi%20Akshay,%0A%0AI%20came%20across%20your%20ShopAI%20project%20and%20would%20like%20to%20connect." className="flex items-center gap-2 text-neutral-500 hover:text-indigo-400 transition-colors text-sm font-medium">
                                        <Mail size={18} /> Contact Me
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Admin Demo */}
                        <div className="bg-neutral-800/40 p-6 rounded-2xl border border-neutral-700/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Lock size={16} className="text-indigo-400" />
                                <h3 className="text-sm font-bold text-neutral-200">Admin Demo Access</h3>
                            </div>
                            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                                This is a portfolio project. Admin credentials available for reviewers.
                            </p>
                            <button
                                onClick={() => setIsAdminModalOpen(true)}
                                className="inline-flex items-center justify-center px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-xs font-semibold text-neutral-200 hover:bg-neutral-600 hover:border-neutral-500 transition-all w-full cursor-pointer"
                            >
                                Go to Admin Portal
                            </button>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-neutral-500 font-medium">
                            © 2025 ShopAI. Built with MERN & AI.
                        </p>
                        <div className="hidden md:flex items-center gap-6">
                            <span className="text-xs text-neutral-600 font-medium">Portfolio Project</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
