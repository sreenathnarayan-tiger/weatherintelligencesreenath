import React from "react";
import { CloudRain, Wind, Thermometer } from "lucide-react";
import { ForecastDay } from "../types";
import { getWeatherCondition } from "../utils/weatherUtils";
import WeatherIcon from "./WeatherIcon";
import { motion } from "motion/react";

interface ForecastDisplayProps {
  daily: ForecastDay[];
}

export default function ForecastDisplay({ daily }: ForecastDisplayProps) {
  // Helper to format date strings into weekdays (e.g., "Mon") and short month-days (e.g., "Jul 21")
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const weekday = d.toLocaleDateString([], { weekday: "short" });
    const monthDay = d.toLocaleDateString([], { month: "short", day: "numeric" });
    return { weekday, monthDay };
  };

  return (
    <div id="forecast-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">
          7-Day Outlook
        </h3>
        <span className="text-xs font-semibold text-zinc-400 dark:placeholder-zinc-500 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-2.5 py-1 rounded-full">
          Weekly Forecast
        </span>
      </div>

      {/* Horizontal scrolling wrapper on mobile, grid layout on desktop */}
      <div 
        id="forecast-grid-container"
        className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 xl:grid xl:grid-cols-7 xl:overflow-x-visible xl:pb-0"
      >
        {daily.map((day, idx) => {
          const { weekday, monthDay } = formatDate(day.date);
          const weatherInfo = getWeatherCondition(day.weatherCode, true);

          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="flex-shrink-0 w-36 xl:w-full p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800/80 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between text-center relative group"
            >
              {/* Floating day number badge for visual interest */}
              <div className="absolute top-3 right-3 text-[10px] font-bold text-zinc-300 dark:text-zinc-700 select-none">
                0{idx + 1}
              </div>

              {/* Day Labels */}
              <div className="mb-3">
                <span className="block font-bold text-sm text-zinc-800 dark:text-zinc-100 uppercase tracking-wide">
                  {weekday}
                </span>
                <span className="block text-[11px] font-medium text-zinc-400 dark:placeholder-zinc-500 mt-0.5">
                  {monthDay}
                </span>
              </div>

              {/* Dynamic Weather Icon */}
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${weatherInfo.theme.bgGrad} text-white mb-3 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                <WeatherIcon name={weatherInfo.icon} size={24} />
              </div>

              {/* Condition Tag */}
              <span className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-1 h-4">
                {weatherInfo.label}
              </span>

              {/* Min/Max Temperature Trend */}
              <div className="w-full space-y-2 mt-auto">
                <div className="flex justify-between items-baseline text-xs px-1">
                  <span className="text-zinc-400 dark:placeholder-zinc-500 font-medium">Min</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{Math.round(day.tempMax)}°</span>
                </div>
                
                {/* Visual mini progress bar for temperature range */}
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      marginLeft: "15%",
                      width: "70%"
                    }}
                  />
                </div>

                <div className="flex justify-between items-baseline text-xs px-1">
                  <span className="text-zinc-400 dark:placeholder-zinc-500 font-medium">Max</span>
                  <span className="font-bold text-zinc-400 dark:placeholder-zinc-500">{Math.round(day.tempMin)}°</span>
                </div>
              </div>

              {/* Additional small stats: Rain and Wind */}
              <div className="w-full border-t border-zinc-100 dark:border-zinc-800/80 mt-4 pt-3 flex items-center justify-between text-[10px] text-zinc-400 dark:placeholder-zinc-500 font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-0.5">
                  <CloudRain className="h-3 w-3 text-indigo-400" />
                  <span>{Math.round(day.precipitationSum)}mm</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Wind className="h-3 w-3 text-teal-400" />
                  <span>{Math.round(day.windSpeedMax)}km/h</span>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
