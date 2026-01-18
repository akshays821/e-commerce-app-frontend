import { useEffect, useState, useMemo } from "react";
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
  const [activeCategory, setActiveCategory] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());

    // Fetch categories to show all (even empty ones)
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        setCategories(data.map(c => c.name));
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, [dispatch]);

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
    setActiveCategory(null);
  };

  // Filter products: AI Results > Category Filter > Search Filter > All
  const productsToShow = useMemo(() => {
    if (aiResults) return aiResults;

    let filtered = products;

    if (activeCategory) {
      filtered = filtered.filter(p => p.category === activeCategory);
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
        <div className="relative pb-12 pt-32">
          <HeroSection />

          <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-20">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSearch={handleAISearch}
              onReset={handleResetSearch}
              showReset={aiResults !== null || search.length > 0}
              loading={aiLoading}
            />
          </div>
        </div>

        {/* Categories & Products Section - White Card Effect */}
        <div className="bg-white/40 backdrop-blur-3xl border-t border-white/20 min-h-screen rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] -mt-4 relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">

            <CategorySection
              categories={displayCategories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />

            <div id="products-section" className="scroll-mt-20">
              {/* Reset filter banner if active */}
              {(activeCategory) && (
                <div className="mb-6 flex items-center justify-between bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10">
                  <div>
                    <h3 className="font-semibold text-primary">Showing results for <span className="text-foreground">"{activeCategory}"</span></h3>
                  </div>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Clear filter
                  </button>
                </div>
              )}

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

              {!loading && productsToShow.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No products found.</p>
                  {activeCategory && <button onClick={() => setActiveCategory(null)} className="text-primary mt-2 hover:underline">Clear Filters</button>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
