import { Sparkles, LogIn, LogOut, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/userAuthSlice";
import toast from "react-hot-toast";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.userAuth);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      dispatch(logout());
      toast.success("Logged out successfully");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-white/95 to-blue-50/40 backdrop-blur-2xl border-b border-blue-100/60 shadow-sm shadow-blue-900/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
                  ShopAI
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Store
                </span>
              </div>
            </div>

            <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent mx-2"></div>

            <nav className="hidden md:flex gap-6">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Discover</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Deals</a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">New</a>
            </nav>
          </div>

          {/* Auth Button */}
          <div>
            {isAuthenticated ? (
              <button
                onClick={handleAuthAction}
                className="group relative w-10 h-10 rounded-xl bg-secondary/50 border border-transparent hover:border-primary/20 hover:bg-white flex items-center justify-center transition-all overflow-hidden"
                title="Logout"
              >
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                  <User className="w-5 h-5 text-foreground" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                  <LogOut className="w-4 h-4 text-red-500" />
                </div>
              </button>
            ) : (
              <button
                onClick={handleAuthAction}
                className="group flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all
                  bg-primary text-primary-foreground shadow-lg shadow-blue-500/25 
                  hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                <span>Login</span>
                <LogIn size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
