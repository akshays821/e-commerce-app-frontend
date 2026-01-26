import { Sparkles, LogIn, LogOut, User, ShoppingCart, Package, ChevronDown, Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logout } from "../redux/slices/userAuthSlice";
import toast from "react-hot-toast";
import newLogo from "../assets/logo2.png";
import { motion, AnimatePresence } from "framer-motion";



export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useSelector((state) => state.userAuth);
  const { totalQuantity } = useSelector((state) => state.cart);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Login Tooltip State
  const [showLoginTooltip, setShowLoginTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip if: Not authenticated, on Home page, and hasn't been dismissed yet
    if (!isAuthenticated && location.pathname === "/" && !sessionStorage.getItem("shoppai_login_tooltip_seen")) {
      setShowLoginTooltip(true);
    } else {
      setShowLoginTooltip(false);
    }
  }, [isAuthenticated, location.pathname]);

  const dismissTooltip = () => {
    setShowLoginTooltip(false);
    sessionStorage.setItem("shoppai_login_tooltip_seen", "true");
  };

  // Search State
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // Dispatch search event or navigate to search results
      // Since existing search logic is page-based, we'll navigate to home with query
      navigate(`/?search=${encodeURIComponent(search)}`);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    setIsDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-violet-50/80 backdrop-blur-xl border-b border-violet-200/40 shadow-sm shadow-violet-900/5 transition-all duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-4 md:gap-8">

          {/* Logo Section */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Mobile Menu Toggle (Optional for future) */}
            {/* <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button> */}

            <Link to="/" className="block">
              <img
                src={newLogo}
                alt="ShopAI"
                className="h-12 md:h-16 object-contain hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {/* Central AI Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-auto flex-col items-center justify-center relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <Sparkles className="w-5 h-5 text-violet-600 animate-pulse" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ask AI for anything..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                className="w-full h-12 pl-12 pr-12 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-violet-200/80 shadow-lg shadow-violet-100/50 text-slate-800 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all duration-300"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center justify-center z-10"
                onClick={() => search && setSearch("")}
              >
                {search ? <X className="w-5 h-5 text-slate-400 hover:text-slate-600" /> : null}
              </button>
            </form>
          </div>

          {/* Cart & Auth Section */}
          <div className="flex items-center gap-2 sm:gap-6 pl-0 flex-shrink-0">

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev ? false : prev) || document.getElementById('mobile-search')?.focus()}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              onClickCapture={() => {
                const mobileSearch = document.getElementById('mobile-search-container');
                if (mobileSearch) {
                  mobileSearch.classList.toggle('hidden');
                  if (!mobileSearch.classList.contains('hidden')) {
                    document.getElementById('mobile-search-input')?.focus();
                  }
                }
              }}
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Cart Button */}
            <Link to="/cart" className="relative group p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <ShoppingCart className="w-6 h-6 md:w-5 md:h-5 text-slate-500 group-hover:text-slate-900 transition-colors" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-slate-900/20 animate-in zoom-in">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Auth Dropdown */}
            <div className="ml-1 relative" ref={dropdownRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="group relative flex items-center gap-2 h-10 px-1 sm:px-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <ChevronDown className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-12 right-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 py-1 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-violet-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        to="/my-orders"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-violet-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => navigate("/login")}
                    className="group flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all
                    bg-slate-900 text-white shadow-lg shadow-slate-900/20 
                    hover:bg-slate-800 hover:shadow-slate-900/30 hover:-translate-y-0.5"
                  >
                    <span>Login</span>
                    <LogIn size={16} className="hidden sm:block transition-transform group-hover:translate-x-1" />
                  </button>

                  {/* Creative Login Tooltip/Recommendation */}
                  <AnimatePresence>
                    {showLoginTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute right-0 top-12 md:top-14 w-56 md:w-60 p-3 md:p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-violet-900/30 flex flex-col items-start gap-2 z-[100]"
                      >
                        {/* Arrow pointing up */}
                        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-slate-900 rotate-45 border-t border-l border-slate-800" />

                        <div className="flex justify-between w-full items-start">
                          <h4 className="text-xs md:text-sm font-bold text-white">Unlock Full Access ✨</h4>
                          <button onClick={dismissTooltip} className="text-slate-400 hover:text-white transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed text-left">
                          Sign in to save your cart, track orders, and get personalized AI recommendations!
                        </p>
                        <button
                          onClick={() => {
                            dismissTooltip();
                            navigate("/login");
                          }}
                          className="text-[10px] md:text-xs font-bold text-violet-300 hover:text-white hover:underline mt-1 transition-colors"
                        >
                          Login Now &rarr;
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Note: Dedicated Search Container for small screens (md:hidden) */}
        {/* Mobile Search Bar (Expandable) */}
        <div id="mobile-search-container" className="hidden md:hidden pb-4 px-1 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="w-full relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Sparkles className="w-5 h-5 text-violet-600 animate-pulse" />
            </div>
            <input
              id="mobile-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ask AI for anything..."
              className="w-full h-12 pl-12 pr-12 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100 text-slate-800 placeholder:text-slate-400 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center justify-center z-10"
              onClick={() => search && setSearch("")}
            >
              {search ? <X className="w-5 h-5 text-slate-400 hover:text-slate-600" /> : null}
            </button>
          </form>
        </div>
      </div>
    </header >
  );
}
