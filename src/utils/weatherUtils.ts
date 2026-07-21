export interface WeatherConditionInfo {
  label: string;
  icon: string;
  theme: {
    bgGrad: string;          // Tailwind background gradient classes
    cardBg: string;          // Inner card background transparency styling
    border: string;          // High-contrast borders
    accentText: string;      // Accent colors for typography
    badgeBg: string;         // Badges background
  };
}

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  // Themes
  const themes = {
    clearDay: {
      bgGrad: "from-amber-400 via-orange-450 to-orange-500",
      cardBg: "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md",
      border: "border-amber-200/50 dark:border-amber-900/20",
      accentText: "text-amber-600 dark:text-amber-400",
      badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    },
    clearNight: {
      bgGrad: "from-zinc-900 via-indigo-950 to-black",
      cardBg: "bg-zinc-900/80 dark:bg-zinc-950/80 backdrop-blur-md",
      border: "border-indigo-950/40 dark:border-zinc-800/50",
      accentText: "text-indigo-400 dark:text-indigo-300",
      badgeBg: "bg-indigo-950/60 text-indigo-300 border border-indigo-900/30",
    },
    cloudyDay: {
      bgGrad: "from-sky-400 via-blue-400 to-slate-400",
      cardBg: "bg-white/85 dark:bg-slate-900/80 backdrop-blur-md",
      border: "border-sky-100/50 dark:border-slate-800/50",
      accentText: "text-sky-600 dark:text-sky-400",
      badgeBg: "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
    },
    cloudyNight: {
      bgGrad: "from-slate-800 via-slate-900 to-zinc-905",
      cardBg: "bg-slate-900/80 backdrop-blur-md",
      border: "border-slate-800/50",
      accentText: "text-slate-400",
      badgeBg: "bg-slate-800 text-slate-300",
    },
    rainy: {
      bgGrad: "from-slate-700 via-blue-900 to-zinc-900",
      cardBg: "bg-slate-900/75 dark:bg-slate-950/80 backdrop-blur-md text-white",
      border: "border-blue-900/40 dark:border-zinc-800/50",
      accentText: "text-blue-300 dark:text-blue-400",
      badgeBg: "bg-blue-950/80 text-blue-300 border border-blue-900/40",
    },
    snowy: {
      bgGrad: "from-teal-100 via-sky-200 to-blue-200 text-slate-900",
      cardBg: "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md",
      border: "border-teal-200/50 dark:border-zinc-800/50",
      accentText: "text-teal-600 dark:text-teal-400",
      badgeBg: "bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300",
    },
    stormy: {
      bgGrad: "from-zinc-900 via-purple-950 to-violet-950",
      cardBg: "bg-zinc-900/80 dark:bg-black/80 backdrop-blur-md",
      border: "border-purple-900/30 dark:border-zinc-800/50",
      accentText: "text-purple-400 dark:text-purple-300",
      badgeBg: "bg-purple-950 text-purple-300 border border-purple-900/40",
    },
  };

  // 0: Clear sky
  if (code === 0) {
    return {
      label: "Clear Sky",
      icon: isDay ? "Sun" : "Moon",
      theme: isDay ? themes.clearDay : themes.clearNight,
    };
  }

  // 1, 2, 3: Mainly clear, partly cloudy, and overcast
  if (code === 1) {
    return {
      label: "Mainly Clear",
      icon: isDay ? "Sun" : "Moon",
      theme: isDay ? themes.clearDay : themes.clearNight,
    };
  }
  if (code === 2) {
    return {
      label: "Partly Cloudy",
      icon: isDay ? "CloudSun" : "CloudMoon",
      theme: isDay ? themes.cloudyDay : themes.cloudyNight,
    };
  }
  if (code === 3) {
    return {
      label: "Overcast",
      icon: "Cloud",
      theme: isDay ? themes.cloudyDay : themes.cloudyNight,
    };
  }

  // 45, 48: Fog and depositing rime fog
  if (code === 45 || code === 48) {
    return {
      label: code === 45 ? "Foggy" : "Depositing Fog",
      icon: "CloudFog",
      theme: isDay ? themes.cloudyDay : themes.cloudyNight,
    };
  }

  // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
  // 56, 57: Freezing Drizzle: Light and dense intensity
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return {
      label: "Drizzle",
      icon: "CloudDrizzle",
      theme: themes.rainy,
    };
  }

  // 61, 63, 65: Rain: Slight, moderate and heavy intensity
  // 66, 67: Freezing Rain: Light and heavy intensity
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67) {
    return {
      label: code === 65 ? "Heavy Rain" : "Rainy",
      icon: "CloudRain",
      theme: themes.rainy,
    };
  }

  // 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
  // 77: Snow grains
  if (code === 71 || code === 73 || code === 75 || code === 77) {
    return {
      label: "Snowfall",
      icon: "Snowflake",
      theme: themes.snowy,
    };
  }

  // 80, 81, 82: Rain showers: Slight, moderate, and violent
  if (code === 80 || code === 81 || code === 82) {
    return {
      label: "Rain Showers",
      icon: "CloudRain",
      theme: themes.rainy,
    };
  }

  // 85, 86: Snow showers slight and heavy
  if (code === 85 || code === 86) {
    return {
      label: "Snow Showers",
      icon: "Snowflake",
      theme: themes.snowy,
    };
  }

  // 95: Thunderstorm: Slight or moderate
  // 96, 99: Thunderstorm with slight and heavy hail
  if (code === 95 || code === 96 || code === 99) {
    return {
      label: "Thunderstorm",
      icon: "CloudLightning",
      theme: themes.stormy,
    };
  }

  // Fallback
  return {
    label: "Unknown Conditions",
    icon: "Cloud",
    theme: isDay ? themes.cloudyDay : themes.cloudyNight,
  };
}
