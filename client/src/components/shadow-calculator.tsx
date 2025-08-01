import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Ruler, MapPin, Compass, Footprints, Calendar, Clock, Navigation, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shadowCalculationSchema, type ShadowCalculation, type ShadowResults, type WeatherData, type SoulInterpretation } from "@shared/schema";
import { calculateShadowLength, generateSoulInterpretation } from "@/lib/shadow-calculations";
import { fetchWeatherData, geocodeCity } from "@/lib/weather-api";

interface ShadowCalculatorProps {
  onCalculation: (results: ShadowResults, weather: WeatherData, interpretation: SoulInterpretation) => void;
  isCalculating: boolean;
  setIsCalculating: (calculating: boolean) => void;
}

export function ShadowCalculator({ onCalculation, isCalculating, setIsCalculating }: ShadowCalculatorProps) {
  const [citySearchResults, setCitySearchResults] = useState<Array<{
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
  }>>([]);
  const [showCityResults, setShowCityResults] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const { toast } = useToast();

  const form = useForm<ShadowCalculation>({
    resolver: zodResolver(shadowCalculationSchema),
    defaultValues: {
      height: 6,
      heightUnit: "ft",
      latitude: 40.7128,
      longitude: -74.0060,
      direction: "North",
      shoeBrand: "Nike",
      date: new Date().toISOString().split('T')[0],
      time: "12:00",
    },
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude);
          form.setValue("longitude", position.coords.longitude);
          setLocationInput(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          toast({
            title: "Location Updated",
            description: "Your current location has been set.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter coordinates manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  const searchCity = async (city: string) => {
    if (city.length < 2) {
      setCitySearchResults([]);
      setShowCityResults(false);
      return;
    }

    try {
      const results = await geocodeCity(city);
      setCitySearchResults(results);
      setShowCityResults(results.length > 0);
    } catch (error) {
      console.error("City search error:", error);
    }
  };

  const selectCity = (city: any) => {
    form.setValue("latitude", city.lat);
    form.setValue("longitude", city.lon);
    setLocationInput(`${city.name}, ${city.country}`);
    setShowCityResults(false);
    setCitySearchResults([]);
  };

  const onSubmit = async (data: ShadowCalculation) => {
    setIsCalculating(true);
    
    try {
      // Calculate shadow length
      const shadowResults = calculateShadowLength(data);
      
      if (!shadowResults.shadowExists) {
        toast({
          title: "No Shadow",
          description: "The sun is below the horizon at this time. No shadow can be cast.",
          variant: "destructive",
        });
        setIsCalculating(false);
        return;
      }

      // Fetch weather data
      const weatherData = await fetchWeatherData(data.latitude, data.longitude);
      
      // Generate soul interpretation
      const soulInterpretation = generateSoulInterpretation(data, shadowResults);
      
      // Pass results to parent
      onCalculation(shadowResults, weatherData, soulInterpretation);
      
      toast({
        title: "Shadow Calculated",
        description: "Your soul silhouette has been revealed.",
      });
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Calculation Error",
        description: "Unable to calculate shadow. Please check your inputs.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (locationInput && !locationInput.includes(',') && isNaN(parseFloat(locationInput))) {
        searchCity(locationInput);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [locationInput]);

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="minimal-card border-0">
        <CardContent className="p-12">
          <div className="text-center mb-10">
            <Sun className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-light text-foreground">Shadow Parameters</h3>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {/* Input Grid with minimalist design */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Height Input */}
                <div className="space-y-4">
                  <FormLabel className="flex items-center text-sm font-light text-muted-foreground">
                    <Ruler className="icon-minimal mr-3" />
                    Height
                  </FormLabel>
                  <div className="flex gap-3">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="6.0"
                              step="0.1"
                              min="0"
                              className="bg-transparent border-border/30 focus:border-primary/50 rounded-2xl px-4 py-3"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="heightUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-20 bg-transparent border-border/30 rounded-2xl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ft">ft</SelectItem>
                                <SelectItem value="cm">cm</SelectItem>
                                <SelectItem value="m">m</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location Input */}
                <div className="space-y-4 relative">
                  <FormLabel className="flex items-center text-sm font-light text-muted-foreground">
                    <MapPin className="icon-minimal mr-3" />
                    Location
                  </FormLabel>
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="New York or 40.7128, -74.0060"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      className="bg-transparent border-border/30 focus:border-primary/50 rounded-2xl px-4 py-3"
                    />
                    {showCityResults && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-card rounded-2xl shadow-lg border border-border max-h-48 overflow-y-auto">
                        {citySearchResults.map((city, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectCity(city)}
                            className="w-full px-4 py-3 text-left hover:bg-muted/50 text-sm first:rounded-t-2xl last:rounded-b-2xl"
                          >
                            {city.name}, {city.state && `${city.state}, `}{city.country}
                          </button>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      onClick={getCurrentLocation}
                      variant="outline"
                      className="w-full border-border/30 rounded-2xl py-3 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Use Current Location
                    </Button>
                  </div>
                </div>

                {/* Direction Facing */}
                <FormField
                  control={form.control}
                  name="direction"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="flex items-center text-sm font-light text-muted-foreground">
                        <Compass className="icon-minimal mr-3" />
                        Direction
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="bg-transparent border-border/30 focus:border-primary/50 rounded-2xl px-4 py-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="North">North</SelectItem>
                            <SelectItem value="Northeast">Northeast</SelectItem>
                            <SelectItem value="East">East</SelectItem>
                            <SelectItem value="Southeast">Southeast</SelectItem>
                            <SelectItem value="South">South</SelectItem>
                            <SelectItem value="Southwest">Southwest</SelectItem>
                            <SelectItem value="West">West</SelectItem>
                            <SelectItem value="Northwest">Northwest</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Shoe Brand */}
                <FormField
                  control={form.control}
                  name="shoeBrand"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="flex items-center text-sm font-light text-muted-foreground">
                        <Footprints className="icon-minimal mr-3" />
                        Footwear
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="bg-transparent border-border/30 focus:border-primary/50 rounded-2xl px-4 py-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nike">Nike</SelectItem>
                            <SelectItem value="Adidas">Adidas</SelectItem>
                            <SelectItem value="Converse">Converse</SelectItem>
                            <SelectItem value="Vans">Vans</SelectItem>
                            <SelectItem value="Puma">Puma</SelectItem>
                            <SelectItem value="Reebok">Reebok</SelectItem>
                            <SelectItem value="New Balance">New Balance</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date and Time Selection */}
              <div className="space-y-8 pt-8 border-t border-border/20">
                <div className="text-center">
                  <h4 className="text-lg font-light text-muted-foreground mb-6">When & Where</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Date Input */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="flex items-center text-sm font-light text-muted-foreground">
                          <Calendar className="icon-minimal mr-3" />
                          Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-transparent border-border/30 focus:border-primary/50 rounded-2xl px-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time Input */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="flex items-center text-sm font-light text-muted-foreground">
                          <Clock className="icon-minimal mr-3" />
                          Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            className="bg-transparent border-border/30 focus:border-primary/50 rounded-2xl px-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <div className="text-center pt-10">
                <Button 
                  type="submit" 
                  disabled={isCalculating}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-4 text-lg font-light rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isCalculating ? (
                    <>Calculating...</>
                  ) : (
                    <>Calculate Shadow</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}