import { Sparkles, LogIn, LogOut, User, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../redux/slices/userAuthSlice";
import newLogo from "../assets/logo2.png";




export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.userAuth);
  const { totalQuantity } = useSelector((state) => state.cart);

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
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link to="/" className="block">
              <img
                src={newLogo}
                alt="ShopAI"
                className="h-20 object-contain hover:opacity-90 transition-opacity"
              />
            </Link>

            <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent mx-2"></div>

            <div className="hidden md:flex gap-6 items-center">
              <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-default">
                Smart Shopping, Powered By AI
              </span>
            </div>
          </div>

          {/* Cart & Auth Section */}
          <div className="flex items-center gap-12 pl-8 border-l border-blue-100/50">
            {/* Cart Button */}
            <Link to="/cart" className="relative group p-2 rounded-xl hover:bg-secondary/50 transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-blue-500/20 animate-in zoom-in">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            <div className="ml-2">
              {isAuthenticated ? (
                <button
                  onClick={handleAuthAction}
                  className="group relative w-10 h-10 rounded-xl bg-secondary/50 border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-all overflow-hidden"
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
      </div>
    </header >
  );
}
