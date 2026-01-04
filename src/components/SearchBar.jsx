import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onReset,
  showReset,
  loading,
}) {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 flex items-center gap-3 bg-card border rounded-2xl px-5 py-3">
          <Search className="w-5 h-5 text-muted-foreground" />

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent outline-none text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          />

          {value && (
            <button onClick={onReset}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

       <div className="flex gap-2">
  <button
  onClick={onSearch}
  disabled={loading}
  className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all
    ${loading
      ? "bg-primary/70 cursor-not-allowed"
      : "bg-primary hover:scale-105"}
  `}
>
  {loading ? (
    <>
      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
      Searching…
    </>
  ) : (
    "Search"
  )}
</button>


  {showReset && (
    <button
      onClick={onReset}
      className="px-4 py-3 rounded-xl border text-sm font-medium text-white"
    >
      Reset
    </button>
  )}
</div>

      </div>

      <p className="text-center text-xs text-muted-foreground mt-2">
        Try: "wireless headphones under 500"
      </p>
    </div>
  );
}
