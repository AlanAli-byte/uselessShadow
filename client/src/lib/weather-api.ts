import { apiRequest } from "./queryClient";
import type { WeatherData } from "@shared/schema";

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await apiRequest("GET", `/api/weather?lat=${lat}&lon=${lon}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    // Return default weather data
    return {
      description: "Clear",
      temperature: 20,
      cloudCover: 0,
      visibility: "10km",
    };
  }
}

export async function geocodeCity(city: string): Promise<Array<{
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}>> {
  try {
    const response = await apiRequest("GET", `/api/geocode?city=${encodeURIComponent(city)}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to geocode city:", error);
    return [];
  }
}