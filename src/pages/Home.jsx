import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import { fetchProducts } from "../redux/slices/productsSlice";
import { logout } from "../redux/slices/userAuthSlice";
import Lottie from "lottie-react";
import toast from "react-hot-toast";

import searchAnimation from "../assets/search imm.json";
import GlobalLoading from "../components/GlobalLoading";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import TrustBadges from "../components/TrustBadges";
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Need this to read query params

  const searchParams = new URLSearchParams(location.search);
  const urlSearch = searchParams.get('search');

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  const { isAuthenticated } = useSelector(
    (state) => state.userAuth
  );

  const [search, setSearch] = useState("");
  const [aiResults, setAiResults] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // FETCH PRODUCTS
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);


  // AI SEARCH HELPER (Direct for URL params)
  const handleAISearchDirect = async (query) => {
    if (!query?.trim()) return;
    try {
      setAiLoading(true);
      setActiveCategory(null);
      const res = await api.post("/api/search-ai", { message: query });
      setAiResults(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  // SYNC URL SEARCH
  useEffect(() => {
    if (urlSearch) {
      setSearch(urlSearch);
      handleAISearchDirect(urlSearch);
    }
  }, [urlSearch]);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/categories");
        setCategories(data.map(c => c.name));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Compute top 6 categories based on product count
  // Use the fetched categories (limit to 6)
  const displayCategories = useMemo(() => {
    return categories.slice(0, 6);
  }, [categories]);

  const handleAISearch = async () => {
    if (!search.trim()) return;

    try {
      setAiLoading(true);
      setActiveCategory(null); // Clear category filter on AI search
      const res = await api.post(
        "/api/search-ai",
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
    setActiveCategory(null);
  };

  // Filter products: AI Results > Category Filter > Search Filter > All
  const productsToShow = useMemo(() => {
    if (aiResults) return aiResults;

    let filtered = products;

    if (activeCategory) {
      const active = activeCategory.toLowerCase().trim();
      filtered = filtered.filter(p => {
        if (!p.category) return false;
        if (Array.isArray(p.category)) {
          return p.category.some(c => c.toLowerCase().trim() === active);
        }
        return typeof p.category === 'string' && p.category.toLowerCase().trim() === active;
      });
    }

    if (search) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }

    return filtered;
  }, [products, aiResults, activeCategory, search]);


  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section with Search integrated visually */}
        <div className="relative pb-0 md:pb-8 pt-20 md:pt-32">
          <HeroSection />
          {/* SearchBar removed from here as it is now in Header */}
        </div>

        {/* Categories & Products Section - White Card Effect */}
        <div className="bg-white/40 backdrop-blur-3xl border-t border-white/20 min-h-screen rounded-t-[2rem] md:rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] -mt-6 md:-mt-4 relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 space-y-8 md:space-y-16">

            <CategorySection
              categories={displayCategories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />

            <div id="products-section" className="scroll-mt-20">
              {/* Reset filter banner if active */}
              {/* Reset filter banner if active (Category, Search, or AI) */}
              {(activeCategory || search || aiResults) && (
                <div className="mb-6 flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="font-semibold text-slate-700">
                      Showing results for <span className="text-slate-900 font-bold">"{activeCategory || search}"</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCategory(null);
                      setSearch("");
                      handleResetSearch();
                      // Also clear URL params
                      navigate('/');
                    }}
                    className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Use GlobalLoading instead of inline text/spinner */}
              <GlobalLoading isLoading={loading || aiLoading} message={aiLoading ? "AI is curating choices..." : "Loading Collection..."} />

              {error && (
                <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-red-500 font-medium">Failed to load products</p>
                </div>
              )}



              <ProductGrid products={productsToShow} />

              {!loading && productsToShow.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Lottie
                    animationData={searchAnimation} // Reusing the search animation for empty state
                    loop={false} // Play once then stop roughly
                    className="w-64 h-64 opacity-50 grayscale"
                  />
                  <h3 className="text-xl font-semibold text-foreground mt-4">No products found</h3>
                  <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-center">
                    We couldn't find matches for <span className="font-medium text-foreground">"{activeCategory || search}"</span>.
                  </p>

                  {(activeCategory || search) && (
                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        setSearch("");
                        handleResetSearch();
                      }}
                      className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:scale-105"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Why Choose Us - Narrative Section */}
        <WhyChooseUs />

        {/* Trust Badges - Premium Section */}
        <div className="relative z-10">
          <TrustBadges />
        </div>

      </main>

      <Footer />
    </div>
  );
}
