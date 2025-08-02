import type { ShadowCalculation, ShadowResults, SoulInterpretation } from "@shared/schema";

export function calculateShadowLength(data: ShadowCalculation): ShadowResults {
  const { height, heightUnit, latitude, longitude, date, time } = data;

  // Convert height to feet for consistent calculations
  let heightInFeet = height;
  if (heightUnit === "cm") {
    heightInFeet = height * 0.0328084;
  } else if (heightUnit === "m") {
    heightInFeet = height * 3.28084;
  }

  // Parse date and time
  const selectedDate = new Date(`${date}T${time}`);
  const dayOfYear = getDayOfYear(selectedDate);
  const hourDecimal = selectedDate.getHours() + selectedDate.getMinutes() / 60;

  // Calculate solar declination (δ)
  const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180));

  // Calculate equation of time
  const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
  const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  // Calculate local solar time
  const standardMeridian = Math.round(longitude / 15) * 15; // Simplified timezone calculation
  const localSolarTime = hourDecimal + equationOfTime / 60 + (4 * (standardMeridian - longitude)) / 60;

  // Calculate hour angle (H)
  const hourAngle = 15 * (localSolarTime - 12);

  // Convert to radians
  const latRad = latitude * (Math.PI / 180);
  const decRad = declination * (Math.PI / 180);
  const hourAngleRad = hourAngle * (Math.PI / 180);

  // Calculate sun's altitude angle (α)
  const sinAltitude = Math.sin(latRad) * Math.sin(decRad) + 
                     Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad);
  const altitude = Math.asin(sinAltitude) * (180 / Math.PI);

  // Check if shadow exists - sun must be at least 5 degrees above horizon to cast meaningful shadow
  const shadowExists = altitude > 5;

  if (!shadowExists) {
    return {
      feet: 0,
      planck: "0",
      lightYears: "0",
      horses: 0,
      sunAltitude: altitude,
      shadowExists: false,
    };
  }

  // Calculate shadow length using L = h / tan(α)
  const shadowLengthFeet = heightInFeet / Math.tan(altitude * (Math.PI / 180));

  // Convert to other units
  const planckLength = shadowLengthFeet * 0.3048 / 1.616e-35; // Convert to meters then to Planck lengths
  const lightYears = shadowLengthFeet * 0.3048 / 9.461e15; // Convert to meters then to light years
  const horseUnits = shadowLengthFeet / 8; // Assuming a horse is about 8 feet long

  return {
    feet: Math.abs(shadowLengthFeet),
    planck: planckLength.toExponential(2),
    lightYears: lightYears.toExponential(2),
    horses: Math.abs(horseUnits),
    sunAltitude: altitude,
    shadowExists: true,
  };
}

export function generateSoulInterpretation(
  calculation: ShadowCalculation, 
  results: ShadowResults
): SoulInterpretation {
  const { shoeBrand, direction } = calculation;
  const shadowLength = results.feet;

  // Generate interpretation based on shadow length and inputs
  let title = "";
  let description = "";
  let traits = [];

  if (shadowLength < 2) {
    title = "The Focused Soul";
    description = `Your shadow measures ${shadowLength.toFixed(2)} feet, revealing a soul that stands tall in the light of truth. Like a sundial at noon, you cast minimal shadows because you face life directly. Your ${shoeBrand} shoes ground you to reality while your spirit reaches for clarity.`;
    traits = [
      { name: "Directness", description: "You approach life with honesty", icon: "arrow-right" },
      { name: "Clarity", description: "Your vision cuts through confusion", icon: "eye" },
      { name: "Presence", description: "You live fully in the moment", icon: "circle" },
    ];
  } else if (shadowLength < 5) {
    title = "The Balanced Wanderer";
    description = `At ${shadowLength.toFixed(2)} feet, your shadow speaks of perfect equilibrium between earth and sky. Facing ${direction.toLowerCase()}, you navigate life with measured steps in your ${shoeBrand} shoes, leaving a meaningful impression on the world.`;
    traits = [
      { name: "Balance", description: "You find harmony in all things", icon: "scale" },
      { name: "Wisdom", description: "Your choices reflect deep thought", icon: "book" },
      { name: "Growth", description: "You evolve with each step", icon: "trending-up" },
    ];
  } else {
    title = "The Profound Dreamer";
    description = `Your ${shadowLength.toFixed(2)}-foot shadow stretches across the earth like a bridge between worlds. In your ${shoeBrand} shoes, you carry dreams that cast long shadows, influencing far more than your immediate presence suggests.`;
    traits = [
      { name: "Vision", description: "You see beyond the immediate", icon: "telescope" },
      { name: "Influence", description: "Your impact extends far", icon: "ripple" },
      { name: "Depth", description: "You think in dimensions", icon: "layers" },
    ];
  }

  return {
    title,
    description,
    traits,
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}