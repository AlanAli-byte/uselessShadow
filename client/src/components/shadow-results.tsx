import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Ruler, Zap, Star, Heart, Sun } from "lucide-react";
import type { ShadowResults, WeatherData } from "@shared/schema";

interface ShadowResultsProps {
  results: ShadowResults;
  weather: WeatherData;
}

export function ShadowResults({ results, weather }: ShadowResultsProps) {
  const getWeatherIcon = (description: string) => {
    if (description.toLowerCase().includes('cloud')) {
      return <Cloud className="w-6 h-6 text-blue-500" />;
    }
    return <Sun className="w-6 h-6 text-yellow-500" />;
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h3 className="text-2xl font-light text-foreground mb-2">Measurements</h3>
        <p className="text-sm text-muted-foreground font-light">Your shadow in different units</p>
      </div>
      
      {/* Weather Indicator */}
      <Card className="minimal-card">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            {getWeatherIcon(weather.description)}
          </div>
          <p className="text-sm text-foreground capitalize font-light">{weather.description}</p>
          <p className="text-xs text-muted-foreground mt-1">Current conditions</p>
        </CardContent>
      </Card>

      {/* Shadow Length Results with minimalist design */}
      <div className="space-y-6">
        <Card className="minimal-card hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Ruler className="w-5 h-5 text-primary mr-4" />
                <span className="text-sm font-light text-muted-foreground">Feet</span>
              </div>
              <span className="text-2xl font-light font-mono text-foreground">
                {results.feet.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="minimal-card hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-primary mr-4" />
                <span className="text-sm font-light text-muted-foreground">Planck Lengths</span>
              </div>
              <span className="text-lg font-light font-mono text-foreground">
                {results.planck}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="minimal-card hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-primary mr-4" />
                <span className="text-sm font-light text-muted-foreground">Light Years</span>
              </div>
              <span className="text-lg font-light font-mono text-foreground">
                {results.lightYears}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="minimal-card hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="w-5 h-5 text-primary mr-4" />
                <span className="text-sm font-light text-muted-foreground">Horse Units</span>
              </div>
              <span className="text-2xl font-light font-mono text-foreground">
                {results.horses.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}