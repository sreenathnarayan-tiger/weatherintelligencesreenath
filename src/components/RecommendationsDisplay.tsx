import React from "react";
import { 
  AlertTriangle, 
  Shirt, 
  Sparkles, 
  CheckCircle2, 
  Calendar,
  Clock,
  Compass,
  CornerDownRight,
  Info
} from "lucide-react";
import { WeatherIntelligenceResponse } from "../types";
import WeatherIcon from "./WeatherIcon";
import { motion } from "motion/react";

interface RecommendationsDisplayProps {
  recommendations: WeatherIntelligenceResponse;
  cityName: string;
}

export default function RecommendationsDisplay({ recommendations, cityName }: RecommendationsDisplayProps) {
  const { generalSummary, warnings, apparel, activities, dailyTips } = recommendations;

  // Simple day mapper for tips
  const formatTipDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div id="recommendations-container" className="space-y-6">
      
      {/* Title Header with Intelligence Badge */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              AI Planning Intelligence
            </h3>
            <p className="text-xs text-zinc-400 dark:placeholder-zinc-500 font-medium">
              Tailored weather schedules for {cityName}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-55/80 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Optimized
        </span>
      </div>

      {/* General Summary Context */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/50 to-sky-50/30 dark:from-indigo-950/20 dark:to-zinc-900/10 border border-indigo-100/50 dark:border-indigo-900/20"
      >
        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
          Weekly Weather Narrative
        </span>
        <p className="text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
          {generalSummary}
        </p>
      </motion.div>

      {/* Warnings & Alerts Section if present */}
      {warnings && warnings.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-start gap-3.5"
        >
          <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
              Safety & Comfort Advisory
            </span>
            <ul className="list-none space-y-1.5">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-amber-500" />
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Bento Layout: Left = Apparel, Right = Activity Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Apparel Matrix (4 Cols) */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800/80 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/45 text-teal-600 dark:text-teal-400">
              <Shirt className="h-4.5 w-4.5" />
            </div>
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
              Apparel Suitability
            </h4>
          </div>

          <div className="space-y-3.5">
            {/* Headwear */}
            <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850/40 transition-colors">
              <span className="text-xs font-bold text-zinc-400 dark:placeholder-zinc-500 uppercase tracking-wider mt-0.5">Head</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-right max-w-[70%] leading-tight">
                {apparel.head}
              </span>
            </div>

            {/* Torso */}
            <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850/40 transition-colors border-t border-zinc-50 dark:border-zinc-800/40">
              <span className="text-xs font-bold text-zinc-400 dark:placeholder-zinc-500 uppercase tracking-wider mt-0.5">Torso</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-right max-w-[70%] leading-tight">
                {apparel.torso}
              </span>
            </div>

            {/* Legs */}
            <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850/40 transition-colors border-t border-zinc-50 dark:border-zinc-800/40">
              <span className="text-xs font-bold text-zinc-400 dark:placeholder-zinc-500 uppercase tracking-wider mt-0.5">Legwear</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-right max-w-[70%] leading-tight">
                {apparel.legs}
              </span>
            </div>

            {/* Footwear */}
            <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850/40 transition-colors border-t border-zinc-50 dark:border-zinc-800/40">
              <span className="text-xs font-bold text-zinc-400 dark:placeholder-zinc-500 uppercase tracking-wider mt-0.5">Footwear</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-right max-w-[70%] leading-tight">
                {apparel.footwear}
              </span>
            </div>

            {/* Accessories Badges */}
            <div className="border-t border-zinc-100 dark:border-zinc-800/50 pt-3.5 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 dark:placeholder-zinc-500 uppercase tracking-wider block">
                Crucial Add-ons
              </span>
              <div className="flex flex-wrap gap-1.5">
                {apparel.accessories.map((acc, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Planners (7 Cols) */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-7 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
              Recommended Activities Today
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activities.map((act, index) => (
              <div 
                key={index}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800/80 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider ${
                      act.type === 'outdoor' 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                    }`}>
                      {act.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200">{act.suitability}%</span>
                      <span className="text-[10px] font-semibold text-zinc-400">fit</span>
                    </div>
                  </div>

                  <h5 className="font-bold text-sm text-zinc-800 dark:text-zinc-100 line-clamp-1 mb-1.5 flex items-center gap-1.5">
                    <span className="p-1.5 rounded-lg bg-zinc-150/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      <WeatherIcon name={act.iconName} size={14} />
                    </span>
                    {act.name}
                  </h5>

                  <p className="text-xs font-medium text-zinc-400 dark:placeholder-zinc-500 leading-normal line-clamp-3">
                    {act.explanation}
                  </p>
                </div>

                {/* Micro safety fit gauge */}
                <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-850 rounded-full overflow-hidden mt-3.5">
                  <div 
                    className={`h-full rounded-full ${
                      act.suitability >= 80 
                        ? 'bg-emerald-500' 
                        : act.suitability >= 50 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${act.suitability}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Planner Schedule (12 Cols wide) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-150 dark:border-zinc-800/80 space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/45 text-amber-600 dark:text-amber-400">
            <Calendar className="h-4.5 w-4.5" />
          </div>
          <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
            7-Day Dynamic Planner Guide
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyTips.map((tipObj, idx) => (
            <div 
              key={tipObj.date}
              className="p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 border border-zinc-100/50 dark:border-zinc-900/40 flex items-start gap-3 group transition-colors"
            >
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 shadow-xs text-center min-w-16">
                <span className="block text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                  Day {idx + 1}
                </span>
                <span className="block text-[10px] font-bold text-zinc-400 dark:placeholder-zinc-500">
                  {formatTipDate(tipObj.date).split(",")[0]}
                </span>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                    {formatTipDate(tipObj.date)}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-150/60 dark:bg-zinc-800 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    <Clock className="h-2.5 w-2.5 opacity-70" />
                    {tipObj.bestTimeSlot}
                  </span>
                </div>
                <p className="text-xs font-medium text-zinc-400 dark:placeholder-zinc-500 leading-normal flex items-start gap-1">
                  <CornerDownRight className="h-3 w-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{tipObj.tip}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
