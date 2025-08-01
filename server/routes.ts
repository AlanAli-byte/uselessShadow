import type { Express } from "express";
import { createServer, type Server } from "http";
import { weatherDataSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather API endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY || "demo_key";
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      
      const response = await fetch(weatherUrl);
      
      if (!response.ok) {
        throw new Error(`Weather API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const weatherData = {
        description: data.weather[0]?.description || "Clear",
        temperature: data.main?.temp || 20,
        cloudCover: data.clouds?.all || 0,
        visibility: data.visibility ? `${Math.round(data.visibility / 1000)}km` : "10km",
      };

      const validatedData = weatherDataSchema.parse(weatherData);
      res.json(validatedData);
    } catch (error) {
      console.error("Weather API error:", error);
      // Return default weather data on error
      res.json({
        description: "Clear",
        temperature: 20,
        cloudCover: 0,
        visibility: "10km",
      });
    }
  });

  // Geocoding endpoint for city search
  app.get("/api/geocode", async (req, res) => {
    try {
      const { city } = req.query;
      
      if (!city) {
        return res.status(400).json({ error: "City name is required" });
      }

      const apiKey = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY || "demo_key";
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city as string)}&limit=5&appid=${apiKey}`;
      
      const response = await fetch(geocodeUrl);
      
      if (!response.ok) {
        throw new Error(`Geocoding API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const results = data.map((location: any) => ({
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon,
      }));

      res.json(results);
    } catch (error) {
      console.error("Geocoding API error:", error);
      res.status(500).json({ error: "Failed to geocode city" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
