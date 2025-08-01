import { Card, CardContent } from "@/components/ui/card";
import { Sun, Circle } from "lucide-react";
import type { ShadowResults } from "@shared/schema";

interface ShadowVisualizationProps {
  results: ShadowResults;
}

export function ShadowVisualization({ results }: ShadowVisualizationProps) {
  // Calculate relative shadow size for visualization (max 180px)
  const maxShadowWidth = 180;
  const shadowWidth = Math.min(results.feet * 15, maxShadowWidth);
  
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h3 className="text-2xl font-light text-foreground mb-2">Visualization</h3>
        <p className="text-sm text-muted-foreground font-light">Your shadow in perspective</p>
      </div>
      
      <Card className="minimal-card bg-gradient-to-b from-orange-50/20 to-amber-50/20 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200/20 dark:border-orange-800/20">
        <CardContent className="p-12 aspect-square flex items-end justify-center relative overflow-hidden">
          {/* Sun indicator */}
          <div className="absolute top-6 right-6">
            <div className="relative">
              <Sun className="w-8 h-8 text-orange-400" />
              <div className="absolute -inset-1 bg-orange-400/20 rounded-full blur-sm"></div>
            </div>
          </div>
          
          {/* Person figure - minimalist design */}
          <div className="flex flex-col items-center z-10" style={{ height: '100px' }}>
            {/* Head */}
            <Circle className="w-6 h-6 text-foreground/80 mb-1" />
            {/* Body */}
            <div className="w-1 h-16 bg-foreground/80 rounded-full mb-1"></div>
            {/* Base */}
            <div className="w-4 h-2 bg-foreground/80 rounded-full"></div>
          </div>
          
          {/* Shadow - elegant curved line */}
          <div 
            className="absolute bottom-12 bg-gradient-to-r from-transparent via-foreground/20 to-transparent h-0.5 rounded-full transform -skew-x-12"
            style={{ 
              width: `${shadowWidth}px`,
              left: '50%',
              marginLeft: `-${shadowWidth / 2}px`
            }}
          ></div>
          
          {/* Measurement indicator */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="text-xs font-light text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
              {results.feet.toFixed(1)} feet
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}