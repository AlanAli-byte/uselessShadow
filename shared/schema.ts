import { z } from "zod";

export const shadowCalculationSchema = z.object({
  height: z.number().positive("Height must be positive"),
  heightUnit: z.enum(["ft", "cm", "m"]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  direction: z.enum(["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"]),
  shoeBrand: z.enum(["Nike", "Adidas", "Converse", "Vans", "Puma", "Reebok", "New Balance", "Other"]),
  weather: z.enum(["sunny", "rainy", "cloudy", "foggy"]),
  date: z.string(),
  time: z.string(),
});

export const weatherDataSchema = z.object({
  description: z.string(),
  temperature: z.number(),
  cloudCover: z.number(),
  visibility: z.string(),
  selectedWeather: z.enum(["sunny", "rainy", "cloudy", "foggy"]),
});

export const shadowResultsSchema = z.object({
  feet: z.number(),
  planck: z.string(),
  lightYears: z.string(),
  horses: z.number(),
  sunAltitude: z.number(),
  shadowExists: z.boolean(),
});

export const soulInterpretationSchema = z.object({
  title: z.string(),
  description: z.string(),
  traits: z.array(z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(),
  })),
});

export type ShadowCalculation = z.infer<typeof shadowCalculationSchema>;
export type WeatherData = z.infer<typeof weatherDataSchema>;
export type ShadowResults = z.infer<typeof shadowResultsSchema>;
export type SoulInterpretation = z.infer<typeof soulInterpretationSchema>;
