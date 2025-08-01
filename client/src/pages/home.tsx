import { useState } from "react";
import { ShadowCalculator } from "@/components/shadow-calculator";
import { ShadowResults } from "@/components/shadow-results";
import { ShadowVisualization } from "@/components/shadow-visualization";
import { SoulInterpretation } from "@/components/soul-interpretation";
import { Sun, Circle, Sparkles } from "lucide-react";
import type { ShadowCalculation, ShadowResults as ShadowResultsType, WeatherData, SoulInterpretation as SoulInterpretationType } from "@shared/schema";

export default function Home() {
  const [shadowResults, setShadowResults] = useState<ShadowResultsType | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [soulInterpretation, setSoulInterpretation] = useState<SoulInterpretationType | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculation = (
    results: ShadowResultsType, 
    weather: WeatherData, 
    interpretation: SoulInterpretationType
  ) => {
    setShadowResults(results);
    setWeatherData(weather);
    setSoulInterpretation(interpretation);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Circle className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-light text-foreground tracking-wide">Shadow</h1>
          </div>
        </div>
      </header>

      <main className="px-6">
        {/* Hero Section with clean typography */}
        <section className="max-w-4xl mx-auto text-center py-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-extralight text-foreground tracking-tight">
                Calculate Your
              </h2>
              <h3 className="text-6xl font-light text-primary tracking-tight">
                Shadow
              </h3>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Discover the length of your shadow anywhere on Earth, at any time.
              <br />
              From precise measurements to soul interpretations.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="max-w-4xl mx-auto py-16">
          <ShadowCalculator 
            onCalculation={handleCalculation}
            isCalculating={isCalculating}
            setIsCalculating={setIsCalculating}
          />
        </section>

        {/* Results Section with minimal design */}
        {shadowResults && weatherData && (
          <section className="max-w-6xl mx-auto py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <ShadowResults results={shadowResults} weather={weatherData} />
              <ShadowVisualization results={shadowResults} />
            </div>
          </section>
        )}

        {/* Soul Interpretation */}
        {soulInterpretation && (
          <section className="max-w-4xl mx-auto py-16">
            <SoulInterpretation interpretation={soulInterpretation} />
          </section>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="py-16 px-6 mt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary/60" />
            <p className="text-sm text-muted-foreground font-light">
              Where light meets measurement
            </p>
            <Sparkles className="w-5 h-5 text-primary/60" />
          </div>
          <p className="text-xs text-muted-foreground/60">
            © 2024 Shadow Calculator
          </p>
        </div>
      </footer>
    </div>
  );
}
