import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchProducts } from "../redux/slices/productsSlice";
import { logout } from "../redux/slices/userAuthSlice";
import Lottie from "lottie-react";
import toast from "react-hot-toast";

import searchAnimation from "../assets/search imm.json";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  const { isAuthenticated } = useSelector(
    (state) => state.userAuth
  );

  const [search, setSearch] = useState("");
  const [aiResults, setAiResults] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAISearch = async () => {
    if (!search.trim()) return;

    try {
      setAiLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/search-ai`,
        { message: search }
      );

      setAiResults(res.data.products);
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("AI limit reached. Please try later", {
          icon: "⚠️",
        });
      } else {
        toast.error("Something went wrong with AI search.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearch("");
    setAiResults(null);
    setAiLoading(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      dispatch(logout());
      toast.success("Logged out successfully");
    } else {
      navigate("/login");
    }
  };

  const productsToShow = aiResults ?? products;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Auth action button */}
      <div className="max-w-7xl mx-auto px-4 pt-4 flex justify-end">
        <button
          onClick={handleAuthAction}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-border hover:bg-muted transition text-white bg-yellow-800"
        >
          {isAuthenticated ? "Logout" : "Login"}
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-16">
        <HeroSection />

        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={handleAISearch}
          onReset={handleResetSearch}
          showReset={aiResults !== null}
          loading={aiLoading}
        />

        <CategorySection />

        {loading && (
          <p className="text-center text-muted-foreground">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">
            Failed to load products
          </p>
        )}

        {aiLoading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-card px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl">
              <Lottie
                animationData={searchAnimation}
                loop
                className="w-28 h-28 opacity-90 mix-blend-lighten"
              />
              <p className="text-sm font-medium text-foreground">
                AI is finding the best results…
              </p>
            </div>
          </div>
        )}

        <ProductGrid products={productsToShow} />
      </main>
    </div>
  );
}
