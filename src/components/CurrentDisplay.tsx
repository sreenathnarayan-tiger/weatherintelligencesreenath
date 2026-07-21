import React from "react";
import { Wind, Droplets, CloudRain, Snowflake, Thermometer, Clock } from "lucide-react";
import { City, CurrentWeather } from "../types";
import { WeatherConditionInfo } from "../utils/weatherUtils";
import WeatherIcon from "./WeatherIcon";
import { motion } from "motion/react";

interface CurrentDisplayProps {
  city: City;
  current: CurrentWeather;
  weatherInfo: WeatherConditionInfo;
}

export default function CurrentDisplay({ city, current, weatherInfo }: CurrentDisplayProps) {
  // Simple time formatter for current observation
  const formattedTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      id="current-weather-display"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-3xl border p-6 md:p-8 ${weatherInfo.theme.cardBg} ${weatherInfo.theme.border} shadow-xl relative overflow-hidden transition-all duration-300 flex flex-col justify-between`}
    >
      {/* Decorative dynamic ambient glow matched to current weather theme */}
      <div className={`absolute -right-24 -top-24 w-60 h-60 rounded-full bg-gradient-to-br ${weatherInfo.theme.bgGrad} opacity-30 blur-3xl pointer-events-none`} />

      <div className="relative">
        {/* City Info & Time Badge */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <span className="block text-xs font-semibold tracking-wider uppercase opacity-75 mb-1 text-zinc-500 dark:text-zinc-400">
              Current Conditions
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {city.name}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              {[city.admin1, city.country].filter(Boolean).join(", ")}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            <Clock className="h-3.5 w-3.5 opacity-70" />
            <span>Updated: {formattedTime}</span>
          </div>
        </div>

        {/* Temperature and Main Condition */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-7xl md:text-8xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-100">
              {Math.round(current.temperature)}°
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-zinc-400 dark:placeholder-zinc-500">C</span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <Thermometer className="h-3 w-3 opacity-80" />
                Feels {Math.round(current.apparentTemperature)}°
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:text-right">
            <div>
              <span className="block font-bold text-2xl tracking-tight text-zinc-950 dark:text-zinc-100">
                {weatherInfo.label}
              </span>
              <span className={`inline-block px-3 py-1 mt-2 text-xs font-semibold rounded-full ${weatherInfo.theme.badgeBg}`}>
                {current.isDay ? "Daylight Mode" : "Nighttime Mode"}
              </span>
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${weatherInfo.theme.bgGrad} text-white shadow-lg`}>
              <WeatherIcon name={weatherInfo.icon} size={48} className="drop-shadow-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Metrics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
        {/* Metric 1: Humidity */}
        <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-zinc-400 dark:placeholder-zinc-500">Humidity</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{current.relativeHumidity}%</span>
          </div>
        </div>

        {/* Metric 2: Wind */}
        <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-500 dark:text-teal-400">
            <Wind className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-zinc-400 dark:placeholder-zinc-500">Wind Speed</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{current.windSpeed} km/h</span>
          </div>
        </div>

        {/* Metric 3: Rain */}
        <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400">
            <CloudRain className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-zinc-400 dark:placeholder-zinc-500">Precipitation</span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {current.precipitation > 0 ? `${current.precipitation} mm` : "0 mm"}
            </span>
          </div>
        </div>

        {/* Metric 4: Snowfall or Comfort Index */}
        <div className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            {current.snowfall > 0 ? (
              <Snowflake className="h-5 w-5 text-sky-500" />
            ) : (
              <Thermometer className="h-5 w-5" />
            )}
          </div>
          <div>
            <span className="block text-xs font-medium text-zinc-400 dark:placeholder-zinc-500">
              {current.snowfall > 0 ? "Snow Accum" : "Apparent Range"}
            </span>
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {current.snowfall > 0 ? `${current.snowfall} cm` : `${Math.round(current.apparentTemperature)}°C`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
