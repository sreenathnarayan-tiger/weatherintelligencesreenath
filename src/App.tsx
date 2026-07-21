import React, { useState, useEffect } from "react";
import { Sparkles, CloudSun, MapPin, Loader2, RefreshCw, HelpCircle, Thermometer, Wind, Compass } from "lucide-react";
import { City, WeatherDataState, CurrentWeather, ForecastDay } from "./types";
import { getWeatherCondition } from "./utils/weatherUtils";
import { generateLocalRecommendations } from "./utils/localRecommendations";
import CitySearch from "./components/CitySearch";
import CurrentDisplay from "./components/CurrentDisplay";
import ForecastDisplay from "./components/ForecastDisplay";
import RecommendationsDisplay from "./components/RecommendationsDisplay";
import { motion, AnimatePresence } from "motion/react";

// Default city: San Francisco
const DEFAULT_CITY: City = {
  id: 5391959,
  name: "San Francisco",
  latitude: 37.7749,
  longitude: -122.4194,
  country: "United States",
  admin1: "California",
  country_code: "US",
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherDataState | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const fetchWeatherAndRecommendations = async (city: City) => {
    setLoadingWeather(true);
    setWeatherError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,wind_speed_10m_max&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather forecast from provider.");
      }

      const data = await response.json();
      
      if (!data.current || !data.daily) {
        throw new Error("Invalid weather data structure received.");
      }

      const currentMapped: CurrentWeather = {
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        windSpeed: data.current.wind_speed_10m,
        relativeHumidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
        precipitation: data.current.precipitation,
        rain: data.current.rain,
        showers: data.current.showers,
        snowfall: data.current.snowfall,
      };

      const dailyMapped: ForecastDay[] = data.daily.time.map((time: string, idx: number) => ({
        date: time,
        weatherCode: data.daily.weather_code[idx],
        tempMax: data.daily.temperature_2m_max[idx],
        tempMin: data.daily.temperature_2m_min[idx],
        apparentMax: data.daily.apparent_temperature_max[idx],
        apparentMin: data.daily.apparent_temperature_min[idx],
        precipitationSum: data.daily.precipitation_sum[idx],
        windSpeedMax: data.daily.wind_speed_10m_max[idx],
      }));

      // Set initial weather state
      const initialState: WeatherDataState = {
        city,
        current: currentMapped,
        daily: dailyMapped,
        recommendations: null,
        loadingRecommendations: true,
        recommendationsError: null,
      };
      setWeatherData(initialState);

      // Trigger local planning intelligence computation with a tiny visual delay for high-tech feeling
      setTimeout(() => {
        try {
          const localRecs = generateLocalRecommendations(city, currentMapped, dailyMapped);
          setWeatherData((prev) => {
            if (!prev || prev.city.id !== city.id) return prev;
            return {
              ...prev,
              recommendations: localRecs,
              loadingRecommendations: false,
            };
          });
        } catch (error: any) {
          console.error("Local recommendation compilation error:", error);
          setWeatherData((prev) => {
            if (!prev || prev.city.id !== city.id) return prev;
            return {
              ...prev,
              loadingRecommendations: false,
              recommendationsError: "Local recommendations failed to calculate.",
            };
          });
        }
      }, 500);

    } catch (error: any) {
      console.error("Fetch weather error:", error);
      setWeatherError(error.message || "Failed to retrieve local weather.");
    } finally {
      setLoadingWeather(false);
    }
  };

  // Fetch initial city weather on mount and when selectedCity changes
  useEffect(() => {
    fetchWeatherAndRecommendations(selectedCity);
  }, [selectedCity]);

  // Handle reload button
  const handleRefresh = () => {
    fetchWeatherAndRecommendations(selectedCity);
  };

  // Calculate dynamic weather-theme classes
  const weatherInfo = weatherData
    ? getWeatherCondition(weatherData.current.weatherCode, weatherData.current.isDay)
    : null;

  return (
    <div 
      id="app-root-container" 
      className={`min-h-screen w-full transition-all duration-750 ease-out bg-gradient-to-b ${
        weatherInfo ? weatherInfo.theme.bgGrad : "from-slate-100 to-slate-200"
      } p-4 md:p-6 lg:p-8 flex flex-col`}
    >
      {/* Maximum boundary to prevent ultra-wide distortion */}
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-6">
        
        {/* Header Navigation Area */}
        <header id="app-header" className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-3xl p-4 md:px-6 border border-white/20 dark:border-zinc-800/30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-650 text-white shadow-md flex items-center justify-center">
              <CloudSun className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                Weather Intelligence
              </h1>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-none">
                Smart Forecast & Planning Companion
              </p>
            </div>
          </div>

          {/* Integrated geocoding search */}
          <CitySearch onSelectCity={setSelectedCity} currentCity={selectedCity} />
          
          <button
            id="refresh-weather-button"
            onClick={handleRefresh}
            disabled={loadingWeather}
            className="flex items-center justify-center p-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 text-zinc-750 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-xs disabled:opacity-50"
            title="Refresh current data"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${loadingWeather ? "animate-spin text-indigo-500" : ""}`} />
          </button>
        </header>

        {/* Main Application Interface Grid */}
        <main id="app-main" className="flex-1 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            
            {/* Loading Cover */}
            {loadingWeather && (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-96 flex flex-col items-center justify-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200/50 dark:border-zinc-800/40"
              >
                <div className="relative flex flex-col items-center justify-center text-center p-8 max-w-sm">
                  <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mb-4 animate-bounce">
                    <CloudSun className="h-10 w-10 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-850 dark:text-zinc-200">
                    Querying Weather Analytics
                  </h3>
                  <p className="text-xs text-zinc-400 dark:placeholder-zinc-500 mt-2 font-medium">
                    Contacting Open-Meteo satellite arrays to parse localized geocodes and weekly outlooks...
                  </p>
                  <Loader2 className="h-6 w-6 text-indigo-500 animate-spin mt-6" />
                </div>
              </motion.div>
            )}

            {/* Error view */}
            {!loadingWeather && weatherError && (
              <motion.div
                key="error-cover"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full p-8 text-center bg-white/90 dark:bg-zinc-900/90 rounded-3xl border border-red-150 shadow-lg max-w-lg mx-auto my-12"
              >
                <div className="p-3.5 rounded-full bg-red-50 text-red-500 w-12 h-12 mx-auto flex items-center justify-center mb-4">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-850 dark:text-zinc-200">
                  Connection Obstruction
                </h3>
                <p className="text-sm text-zinc-400 dark:placeholder-zinc-500 mt-2 font-medium">
                  {weatherError}
                </p>
                <button
                  id="error-retry-button"
                  onClick={handleRefresh}
                  className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
                >
                  Attempt Reconnection
                </button>
              </motion.div>
            )}

            {/* Loaded Weather dashboard */}
            {!loadingWeather && !weatherError && weatherData && weatherInfo && (
              <motion.div
                key="dashboard-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Left Panel: Primary Weather Conditions (7 columns) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Current Weather Display */}
                  <CurrentDisplay 
                    city={weatherData.city} 
                    current={weatherData.current} 
                    weatherInfo={weatherInfo} 
                  />

                  {/* 7-Day Outlook */}
                  <ForecastDisplay daily={weatherData.daily} />
                </div>

                {/* Right Panel: Planning Recommendations (5 columns) */}
                <div className="lg:col-span-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-200/50 dark:border-zinc-800/40 p-6 shadow-xl relative overflow-hidden flex flex-col">
                  
                  {/* Background overlay accent glow */}
                  <div className="absolute -right-32 -bottom-32 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                  {weatherData.loadingRecommendations ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-500 mb-4 animate-spin">
                        <Sparkles className="h-8 w-8" />
                      </div>
                      <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-200">
                        Compiling Smart Recommendations...
                      </h4>
                      <p className="text-xs text-zinc-400 dark:placeholder-zinc-500 max-w-xs mt-2 leading-relaxed">
                        Analyzing local temperature thresholds, storm risk indices, and weekly precipitation maps to construct custom apparel and active schedules...
                      </p>
                    </div>
                  ) : weatherData.recommendationsError ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-3 rounded-full bg-amber-50 text-amber-500 mb-3">
                        <HelpCircle className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                        Unable to Compile Rules
                      </h4>
                      <p className="text-xs text-zinc-400 dark:placeholder-zinc-500 max-w-xs mt-1.5 mb-5 leading-normal">
                        {weatherData.recommendationsError}
                      </p>
                    </div>
                  ) : weatherData.recommendations ? (
                    <RecommendationsDisplay 
                      recommendations={weatherData.recommendations} 
                      cityName={weatherData.city.name}
                    />
                  ) : null}

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </main>
        
        {/* Minimal credit bar */}
        <footer id="app-footer" className="text-center py-4 border-t border-white/10 dark:border-zinc-850/20">
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <span>Powered by Open-Meteo Satellite data</span>
            <span className="opacity-50">•</span>
            <span>Local Rules Intelligence</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
