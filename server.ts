import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for weather recommendations
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { city, current, daily } = req.body;

      if (!city || !current || !daily) {
        return res.status(400).json({ error: "Missing required weather parameters." });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Return a mock yet responsive response if no API key is set, to avoid crashing the app
        console.warn("GEMINI_API_KEY is not defined. Using responsive fallback generator.");
        const fallback = generateFallbackRecommendations(city, current, daily);
        return res.json(fallback);
      }

      // Lazy load GoogleGenAI
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Construct a prompt rich with current and forecast details
      const prompt = `
Analyze the weather data below for the city of ${city.name} (${city.admin1 ? city.admin1 + ', ' : ''}${city.country || ''}) and generate a personalized, intelligent planning companion guide.

Current Conditions:
- Temperature: ${current.temperature}°C (Feels like ${current.apparentTemperature}°C)
- Relative Humidity: ${current.relativeHumidity}%
- Wind Speed: ${current.windSpeed} km/h
- Precipitation: ${current.precipitation} mm
- Weather Code: ${current.weatherCode}
- Day/Night: ${current.isDay ? 'Daytime' : 'Nighttime'}

7-Day Forecast:
${daily.map((day: any, idx: number) => `Day ${idx + 1} (${day.date}): Max Temp: ${day.tempMax}°C, Min Temp: ${day.tempMin}°C, Max wind: ${day.windSpeedMax} km/h, Precip sum: ${day.precipitationSum} mm, Weather code: ${day.weatherCode}`).join("\n")}

WMO Weather Code Guide (for context):
- 0: Clear sky
- 1, 2, 3: Mainly clear, partly cloudy, and overcast
- 45, 48: Fog or depositing rime fog
- 51, 53, 55: Drizzle of light, moderate, or dense intensity
- 56, 57: Freezing Drizzle: light and dense intensity
- 61, 63, 65: Rain of slight, moderate, or heavy intensity
- 66, 67: Freezing Rain: light and heavy intensity
- 71, 73, 75: Snow fall of slight, moderate, or heavy intensity
- 77: Snow grains
- 80, 81, 82: Rain showers: slight, moderate, and violent
- 85, 86: Snow showers: slight and heavy
- 95: Thunderstorm: slight or moderate
- 96, 99: Thunderstorm with slight and heavy hail

Instructions:
1. Provide a concise, highly readable, and professional 'generalSummary' of the 7-day pattern (e.g. how temperatures trend, any transition from rainy to clear, etc.).
2. List 1-3 appropriate weather 'warnings' (like safety tips for high winds, heat waves, storm risks, freezing temps, or a recommendation to stay hydrated or carry sunscreen/umbrella). If the weather is absolutely perfect, keep warnings minimal or suggest standard comfort.
3. Detail recommended 'apparel' (headwear, torso, legs, footwear, and special accessories) suited specifically to today's current conditions.
4. Recommend exactly 4 diverse, creative 'activities' (mix of indoor and outdoor). For each, specify if it is 'indoor' or 'outdoor', explain the reasoning based on current/forecast weather, state the suitability percentage (0-100), and assign a Lucide React icon name (e.g., 'Compass', 'Tv', 'Dumbbell', 'Footprints', 'Coffee', 'BookOpen', 'Umbrella', 'Sun', 'Bicycle', 'Camera', 'ShoppingBag', 'Sparkles').
5. Fill out a specific, localized 'dailyTips' array containing exactly one highly practical suggestion and the best time slot for each day of the 7-day forecast.

Ensure all recommendations are highly tailored to the specific temperatures, precipitation levels, and conditions provided.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              generalSummary: {
                type: Type.STRING,
                description: "A professional and friendly summary of current weather and the 7-day weather pattern."
              },
              warnings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Urgent weather warnings or general comfort/health warnings. Return empty if none apply."
              },
              apparel: {
                type: Type.OBJECT,
                properties: {
                  head: { type: Type.STRING, description: "Head apparel recommendation" },
                  torso: { type: Type.STRING, description: "Torso apparel recommendation" },
                  legs: { type: Type.STRING, description: "Leg apparel recommendation" },
                  footwear: { type: Type.STRING, description: "Footwear recommendation" },
                  accessories: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Accessories like sunglasses, umbrella, gloves, scarf, etc."
                  }
                },
                required: ["head", "torso", "legs", "footwear", "accessories"]
              },
              activities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING, description: "Must be 'indoor' or 'outdoor'" },
                    explanation: { type: Type.STRING },
                    suitability: { type: Type.INTEGER, description: "Integer from 0 to 100" },
                    iconName: { type: Type.STRING, description: "Lucide icon name like 'Compass', 'Tv', 'Dumbbell', 'Footprints', 'Coffee', 'BookOpen', 'Umbrella', 'Sun', 'Bicycle', 'Camera'" }
                  },
                  required: ["name", "type", "explanation", "suitability", "iconName"]
                }
              },
              dailyTips: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING, description: "Formatted as YYYY-MM-DD matching the input forecast days" },
                    tip: { type: Type.STRING },
                    bestTimeSlot: { type: Type.STRING }
                  },
                  required: ["date", "tip", "bestTimeSlot"]
                }
              }
            },
            required: ["generalSummary", "warnings", "apparel", "activities", "dailyTips"]
          }
        }
      });

      const responseText = response.text || "";
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({
        error: "Failed to generate recommendations via Gemini API.",
        details: error.message
      });
    }
  });

  // Vite middleware for development or serving compiled client files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

// Helper to generate highly realistic fallbacks if API key is not present or rate limited
function generateFallbackRecommendations(city: any, current: any, daily: any[]) {
  const isHot = current.temperature > 25;
  const isCold = current.temperature < 10;
  const isWet = current.weatherCode >= 51 && current.weatherCode <= 82;
  const isSnow = current.weatherCode >= 71 && current.weatherCode <= 86;

  let head = "A lightweight baseball cap or sunglasses";
  let torso = "Breathable t-shirt or short-sleeved linen shirt";
  let legs = "Comfortable shorts or light chinos";
  let footwear = "Sleek sneakers or casual sandals";
  let accessories = ["Sunglasses", "Sunscreen (SPF 30+)"];
  let warnings: string[] = [];

  if (isHot) {
    warnings.push("High temperature alert: Stay hydrated and avoid direct sun peak hours.");
  }
  if (isCold) {
    head = "Warm insulated beanie";
    torso = "Layered thermal underwear, wool sweater, and heavy windproof coat";
    legs = "Thick corduroy trousers or fleece-lined pants";
    footwear = "Insulated waterproof winter boots";
    accessories = ["Touchscreen-compatible gloves", "Woolen scarf", "Lip balm"];
    warnings.push("Cold advisory: Keep warm and wear layers.");
  } else if (current.temperature >= 10 && current.temperature <= 25) {
    head = "Classic lightweight cap";
    torso = "Comfy crewneck sweater or light denim jacket over a tee";
    legs = "Jeans or tapered cargo pants";
    footwear = "Comfortable everyday sneakers";
    accessories = ["Hydration flask"];
  }

  if (isWet) {
    head = "Water-resistant hat or hood up";
    footwear = "Waterproof leather shoes or rain boots";
    accessories.push("Sturdy travel umbrella", "Waterproof backpack cover");
    warnings.push("Rain alert: Wet roadways and reduced visibility. Pack an umbrella.");
  }
  if (isSnow) {
    warnings.push("Slick surfaces and freezing precipitation. Drive slowly and exercise caution.");
  }

  // Generate activities
  const activities = [
    {
      name: isWet ? "Indoor Specialty Coffee Tasting" : "Scenic Neighborhood Bicycle Ride",
      type: isWet ? "indoor" as const : "outdoor" as const,
      explanation: isWet 
        ? "Rainy hours make for the perfect cozy escape to sample artisanal coffee blends indoors."
        : "Pleasantly clear and wind conditions are ideal for a leisurely bicycle exploration.",
      suitability: isWet ? 95 : 88,
      iconName: isWet ? "Coffee" : "Bicycle"
    },
    {
      name: isCold ? "Art Gallery & Museum Walk" : "Botanical Garden Photography Tour",
      type: isCold ? "indoor" as const : "outdoor" as const,
      explanation: isCold
        ? "Warm museum galleries keep you intellectually stimulated and protected from the winter chill."
        : "Perfect natural lighting and comfortable air are ideal for macro photography outdoors.",
      suitability: isCold ? 90 : 85,
      iconName: isCold ? "BookOpen" : "Camera"
    },
    {
      name: "Core Strength Gym Training",
      type: "indoor" as const,
      explanation: "Regardless of external conditions, high-quality indoor resistance training builds durable fitness.",
      suitability: 95,
      iconName: "Dumbbell"
    },
    {
      name: isWet || isCold ? "Cozy Bookstore Reading Session" : "Sunset Hill Hiking & Picnic",
      type: isWet || isCold ? "indoor" as const : "outdoor" as const,
      explanation: isWet || isCold
        ? "Immerse yourself in new books in a warm corner while watching rain patterns on the glass."
        : "An excellent evening wind speed and temperature set up an unforgettable panoramic picnic.",
      suitability: 88,
      iconName: isWet || isCold ? "BookOpen" : "Compass"
    }
  ];

  // Map daily tips
  const dailyTips = daily.map((day: any) => {
    const dayTemp = (day.tempMax + day.tempMin) / 2;
    const isDayWet = day.precipitationSum > 1;
    let tip = "Great day for routine errands and keeping flexible.";
    let bestTimeSlot = "10:00 - 15:00";

    if (isDayWet) {
      tip = "Expected showers or drizzle. Plan main commutes around rainfall gaps and do laundry indoors.";
      bestTimeSlot = "Avoid late afternoon";
    } else if (dayTemp > 25) {
      tip = "Sunny and warm. Plan outdoor excursions or running early in the morning when the air is crisp.";
      bestTimeSlot = "07:00 - 09:30";
    } else if (dayTemp < 10) {
      tip = "Crisp, cold weather. Great day to explore cozy local cafes or read a novel indoors.";
      bestTimeSlot = "12:00 - 14:30";
    } else {
      tip = "Pleasant weather window. Perfect for outdoor walks, lawn care, or active sports.";
      bestTimeSlot = "15:00 - 18:00";
    }

    return {
      date: day.date,
      tip,
      bestTimeSlot
    };
  });

  return {
    generalSummary: `Currently looking at a temperature of ${current.temperature}°C in ${city.name}. The coming week features maximums peaking at ${Math.max(...daily.map(d => d.tempMax))}°C and lows touching ${Math.min(...daily.map(d => d.tempMin))}°C. Plan tasks with these thermal shifts in mind.`,
    warnings,
    apparel: {
      head,
      torso,
      legs,
      footwear,
      accessories
    },
    activities,
    dailyTips
  };
}

startServer();
