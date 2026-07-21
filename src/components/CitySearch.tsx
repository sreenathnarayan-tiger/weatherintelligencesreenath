import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X, Globe } from "lucide-react";
import { City } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CitySearchProps {
  onSelectCity: (city: City) => void;
  currentCity?: City;
}

export default function CitySearch({ onSelectCity, currentCity }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query.trim()
          )}&count=6&language=en&format=json`
        );
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Geocoding fetch error:", err);
        setError("Failed to fetch cities.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (city: City) => {
    onSelectCity(city);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div id="city-search-container" ref={containerRef} className="relative w-full max-w-md z-50">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-zinc-400" />
          )}
        </div>
        <input
          id="city-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={currentCity ? `${currentCity.name}, ${currentCity.country || ""}` : "Search cities around the world..."}
          className="w-full pl-11 pr-10 py-3 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900/100 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none transition-all duration-200 shadow-sm"
        />
        {query && (
          <button
            id="clear-search-button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (results.length > 0 || error || (query.length >= 2 && !loading && results.length === 0)) && (
          <motion.div
            id="search-dropdown-menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto"
          >
            {error && (
              <div className="p-4 text-sm text-red-500 text-center">{error}</div>
            )}
            {!error && results.length === 0 && query.length >= 2 && (
              <div className="p-4 text-sm text-zinc-500 text-center">
                No matching cities found. Try another spelling.
              </div>
            )}
            {!error && results.length > 0 && (
              <ul className="py-2 divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {results.map((city) => (
                  <li key={city.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(city)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 text-zinc-600 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block font-medium text-zinc-800 dark:text-zinc-100 text-sm">
                            {city.name}
                          </span>
                          <span className="block text-xs text-zinc-400 dark:placeholder-zinc-500">
                            {[city.admin1, city.country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      </div>
                      {city.country_code && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/50 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                          <Globe className="h-3 w-3 opacity-60" />
                          {city.country_code}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
