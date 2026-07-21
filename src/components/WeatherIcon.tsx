import React from "react";
import * as Icons from "lucide-react";

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function WeatherIcon({ name, className = "", size }: WeatherIconProps) {
  // Safe lookup for dynamic icon rendering from Lucide React
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Return a default fallback icon if the specified name is missing or misspelled
    return <Icons.HelpCircle className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
