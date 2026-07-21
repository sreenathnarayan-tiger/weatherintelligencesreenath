export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  windSpeed: number;
  relativeHumidity: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
}

export interface ForecastDay {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface ActivityRecommendation {
  name: string;
  type: 'indoor' | 'outdoor';
  explanation: string;
  suitability: number; // 0 to 100
  iconName: string; // lucide icon name representation
}

export interface ApparelRecommendation {
  head: string;
  torso: string;
  legs: string;
  footwear: string;
  accessories: string[];
}

export interface WeatherIntelligenceResponse {
  generalSummary: string;
  warnings: string[];
  apparel: ApparelRecommendation;
  activities: ActivityRecommendation[];
  dailyTips: {
    date: string;
    tip: string;
    bestTimeSlot: string;
  }[];
}

export interface WeatherDataState {
  city: City;
  current: CurrentWeather;
  daily: ForecastDay[];
  recommendations: WeatherIntelligenceResponse | null;
  loadingRecommendations: boolean;
  recommendationsError: string | null;
}
