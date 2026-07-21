import { City, CurrentWeather, ForecastDay, WeatherIntelligenceResponse } from "../types";

export function generateLocalRecommendations(
  city: City,
  current: CurrentWeather,
  daily: ForecastDay[]
): WeatherIntelligenceResponse {
  const temp = current.temperature;
  const isDay = current.isDay;
  const wind = current.windSpeed;
  const precip = current.precipitation;
  const code = current.weatherCode;

  // 1. Determine dynamic theme states
  const isFreezing = temp < 5;
  const isCold = temp >= 5 && temp < 13;
  const isPleasant = temp >= 13 && temp <= 22;
  const isWarm = temp > 22 && temp <= 30;
  const isHot = temp > 30;

  const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isSnowing = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
  const isStorming = code >= 95;
  const isFoggy = code === 45 || code === 48;
  const isWet = isRainy || isSnowing || isStorming;

  const isWindy = wind > 20;

  // 2. Generate General Summary based on weather analytics
  let generalSummary = "";
  const maxTempInWeek = Math.max(...daily.map((d) => d.tempMax));
  const minTempInWeek = Math.min(...daily.map((d) => d.tempMin));
  const totalWeeklyPrecip = daily.reduce((sum, d) => sum + d.precipitationSum, 0);

  if (isStorming) {
    generalSummary = `Active thunderstorm systems are currently reported near ${city.name}. The 7-day outlook indicates temperatures ranging from ${minTempInWeek}°C to ${maxTempInWeek}°C, with total forecast precipitation around ${totalWeeklyPrecip.toFixed(1)} mm. Exercise caution and consider indoor projects.`;
  } else if (isWet) {
    generalSummary = `A wet atmospheric pattern is active in ${city.name}, with precipitation currently at ${precip} mm. Over the next week, expect temperatures between ${minTempInWeek}°C and ${maxTempInWeek}°C. Total accumulated rainfall will reach approximately ${totalWeeklyPrecip.toFixed(1)} mm.`;
  } else if (isHot) {
    generalSummary = `An intense thermal ridge is bringing high temperatures of ${temp}°C to ${city.name}. The weekly outlook remains warm, peaking around ${maxTempInWeek}°C. Clear skies dominate with minimal rainfall expected (${totalWeeklyPrecip.toFixed(1)} mm total). Keep hydrated.`;
  } else if (isFreezing) {
    generalSummary = `Sub-zero chilled arctic air has settled over ${city.name} at ${temp}°C. The 7-day trend shows sustained freezing winds with a weekly minimum of ${minTempInWeek}°C. Protect plumbing systems and limit prolonged exposure.`;
  } else if (isPleasant) {
    generalSummary = `Superb micro-climate conditions currently present in ${city.name} at a comfortable ${temp}°C. The upcoming 7 days offer excellent stability with highs near ${maxTempInWeek}°C and negligible wet risk. Superb for outdoor execution and training.`;
  } else {
    generalSummary = `Currently experiencing standard ${temp}°C weather conditions in ${city.name}. The coming week features a moderate thermal spread between ${minTempInWeek}°C and ${maxTempInWeek}°C, with a total precipitation outlook of ${totalWeeklyPrecip.toFixed(1)} mm.`;
  }

  // 3. Generate Safety and Comfort Warnings
  const warnings: string[] = [];
  if (isHot) {
    warnings.push("Extreme thermal exposure. Drink electrolytes and restrict outdoor strenuous activity between 11 AM and 4 PM.");
  }
  if (isFreezing) {
    warnings.push("Frostbite hazard on exposed skin. Keep extremities warm and insulated.");
  }
  if (isWindy) {
    warnings.push(`Sustained wind speeds of ${wind} km/h. Secure loose outdoor lightweight patio structures.`);
  }
  if (isStorming) {
    warnings.push("Active lightning discharge risk. Stay indoors and unplug expensive sensitive electronic microprocessors.");
  }
  if (isFoggy) {
    warnings.push("Severe visual fog. Reduce vehicular driving speed and utilize low-beam headlights.");
  }
  if (isRainy) {
    warnings.push("Wet slippery tarmac. Exercise caution while biking, running, or driving.");
  }
  if (warnings.length === 0) {
    warnings.push("Perfect ambient weather index. No active safety warnings or comfort advisories reported.");
  }

  // 4. Determine Custom Tailored Apparel
  let head = "Classic low-profile baseball cap";
  let torso = "Soft breathable combed cotton t-shirt";
  let legs = "Lightweight performance shorts or modern chinos";
  let footwear = "Casual daily canvas sneakers";
  const accessories: string[] = [];

  if (isHot) {
    head = "Wide-brimmed sun protection bucket hat";
    torso = "Ultra-light linen or UV-absorbent athletic shirt";
    legs = "Breathable linen trousers or loose-fitting shorts";
    footwear = "Open-toed leather sandals or ventilated mesh runners";
    accessories.push("Polarized sunglasses", "Broad-spectrum SPF 50+ sunscreen");
  } else if (isFreezing) {
    head = "Fleece-lined thermal knitted beanie";
    torso = "Base layer thermal wool, heavy insulated down parka";
    legs = "Windproof corduroy or double-insulated ski trousers";
    footwear = "Gore-Tex insulated cold-weather boots";
    accessories.push("Windproof gloves", "Heavy fleece neck gaiter", "Moisturizing lip protectant");
  } else if (isCold) {
    head = "Warm merino wool beanie";
    torso = "Long-sleeve Henley shirt paired with an insulated puffer vest";
    legs = "Mid-weight raw denim jeans or flannel-lined chinos";
    footwear = "Durable leather boots or high-top sneakers";
    accessories.push("Lightweight knit scarf", "Insulated pocket hand-warmers");
  } else if (isPleasant) {
    head = "Unstructured dad cap or none";
    torso = "Organic cotton sweatshirt or dynamic lightweight windbreaker over a tee";
    legs = "Stretch athletic joggers or relaxed fit selvage denim";
    footwear = "Comfortable everyday athletic trainers";
    accessories.push("Sleek reusable water bottle");
  }

  if (isWet) {
    head = "Water-repellent nylon bucket hat or hood up";
    torso = "Fully seam-sealed waterproof rain shell with ventilated underarms";
    footwear = "Waterproof trail running shoes or rubber rain boots";
    accessories.push("Sturdy wind-resistant travel umbrella", "Waterproof dry-bag backpack liner");
  }

  if (!isDay && !isFreezing && !isCold) {
    accessories.push("High-intensity LED headlamp or safety reflector");
  }

  // 5. Select 4 Distinct Activity Recommendations
  const activities = [
    // Activity 1: Main active task
    {
      name: isWet || isFreezing
        ? "Cardio HIIT Gym Session"
        : isHot
        ? "Early Morning Trail Run"
        : "Scenic Coastal Bicycle Tour",
      type: (isWet || isFreezing ? "indoor" : "outdoor") as "indoor" | "outdoor",
      explanation: isWet || isFreezing
        ? "Bypass slippery pathways and freezing wind chills with an intensive indoor core cardiovascular session."
        : isHot
        ? "Complete your high-intensity cardio outdoors early before temperatures rise to safe levels."
        : "Excellent cool, crisp wind speeds and temperature ranges create peak cycling efficiency.",
      suitability: isWet ? 95 : isHot ? 80 : 92,
      iconName: isWet || isFreezing ? "Dumbbell" : isHot ? "Footprints" : "Bicycle",
    },
    // Activity 2: Intellectual / Cozy task
    {
      name: isWet || isCold || isFreezing
        ? "Art Gallery Exploration"
        : "Outdoor Botanical Photography",
      type: (isWet || isCold || isFreezing ? "indoor" : "outdoor") as "indoor" | "outdoor",
      explanation: isWet || isCold || isFreezing
        ? "Spend your afternoon inside a temperature-controlled museum space admiring fine art collections."
        : "Fantastic ambient direct daylight and healthy plant growth invite high-fidelity macro photography.",
      suitability: 90,
      iconName: isWet || isCold || isFreezing ? "BookOpen" : "Camera",
    },
    // Activity 3: Social / Coffee task
    {
      name: isWet
        ? "Artisanal Coffee Lab Experience"
        : "Panoramic Hillside Picnic",
      type: (isWet ? "indoor" : "outdoor") as "indoor" | "outdoor",
      explanation: isWet
        ? "Rainy days are perfect for ducking into a local roastery to sample hand-brewed single-origin coffees."
        : "Clear, stable horizon visibility and low wind speed offer premium conditions for a hilltop sunset picnic.",
      suitability: isWet ? 96 : 89,
      iconName: isWet ? "Coffee" : "Compass",
    },
    // Activity 4: Rest / Entertainment task
    {
      name: isWet || isCold
        ? "Cozy Library Book Reading"
        : "Urban Architecture Explorer Walk",
      type: (isWet || isCold ? "indoor" : "outdoor") as "indoor" | "outdoor",
      explanation: isWet || isCold
        ? "Warm up with a vintage novel in an quiet corner of the central city archive library."
        : "A pleasant, high-contrast day creates beautiful geometry for exploring local brick facades and skyscrapers.",
      suitability: 85,
      iconName: isWet || isCold ? "BookOpen" : "Compass",
    },
  ];

  // 6. Generate 7 Daily Tip Planners matched exactly to forecast variables
  const dailyTips = daily.map((day) => {
    const dayCode = day.weatherCode;
    const dayTemp = (day.tempMax + day.tempMin) / 2;
    const dayPrecip = day.precipitationSum;
    const dayWind = day.windSpeedMax;

    let tip = "Standard weather conditions. Suitable for routine errands and fluid scheduling.";
    let bestTimeSlot = "11:00 - 15:00";

    const isDayWet = dayPrecip > 1.5 || (dayCode >= 51 && dayCode <= 82);
    const isDayStorm = dayCode >= 95;
    const isDayWindy = dayWind > 25;
    const isDayHot = dayTemp > 28;
    const isDayCold = dayTemp < 8;

    if (isDayStorm) {
      tip = "Thunderstorm hazard expected. Shift all physical chores indoors and secure critical power banks.";
      bestTimeSlot = "Stay Indoors";
    } else if (isDayWet) {
      tip = "Expected rain showers. Commute with a solid umbrella and schedule indoor laundry.";
      bestTimeSlot = "09:00 - 12:00";
    } else if (isDayHot) {
      tip = "High solar load. Ideal window for pool swimming, beach walks, or doing chores before sunrise.";
      bestTimeSlot = "07:00 - 09:30";
    } else if (isDayWindy) {
      tip = "Brisk winds predicted. Great for kite flying or sailing, but avoid elevated ladder construction tasks.";
      bestTimeSlot = "13:00 - 16:00";
    } else if (isDayCold) {
      tip = "Chilly air. Perfect for trying warm stews, drinking hot cocoa, or reading next to a heater.";
      bestTimeSlot = "12:00 - 14:30";
    } else {
      tip = "Pristine clear air. Exceptional window to schedule lawn maintenance, outdoor gardening, or a run.";
      bestTimeSlot = "15:00 - 18:00";
    }

    return {
      date: day.date,
      tip,
      bestTimeSlot,
    };
  });

  return {
    generalSummary,
    warnings,
    apparel: {
      head,
      torso,
      legs,
      footwear,
      accessories,
    },
    activities,
    dailyTips,
  };
}
