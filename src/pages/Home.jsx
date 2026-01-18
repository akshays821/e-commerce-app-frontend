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



  const productsToShow = aiResults ?? products;

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section with Search integrated visually */}
        <div className="relative pb-12 pt-32">
          <HeroSection />

          <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-20">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSearch={handleAISearch}
              onReset={handleResetSearch}
              showReset={aiResults !== null}
              loading={aiLoading}
            />
          </div>
        </div>

        {/* Categories & Products Section - White Card Effect */}
        <div className="bg-white/40 backdrop-blur-3xl border-t border-white/20 min-h-screen rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] -mt-4 relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">

            <CategorySection />

            <div id="products-section" className="scroll-mt-20">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground font-medium">Loading products...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-red-500 font-medium">Failed to load products</p>
                </div>
              )}

              {aiLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="bg-card px-8 py-6 rounded-3xl flex flex-col items-center gap-4 shadow-2xl animate-in fade-in zoom-in duration-300">
                    <Lottie
                      animationData={searchAnimation}
                      loop
                      className="w-32 h-32 opacity-90 mix-blend-multiply"
                    />
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-foreground">AI is thinking...</h3>
                      <p className="text-sm text-muted-foreground">Finding the best matches for you</p>
                    </div>
                  </div>
                </div>
              )}

              <ProductGrid products={productsToShow} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
