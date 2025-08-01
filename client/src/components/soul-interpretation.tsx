import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Lightbulb, Eye, Layers, Heart, Star, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SoulInterpretation } from "@shared/schema";

interface SoulInterpretationProps {
  interpretation: SoulInterpretation;
}

export function SoulInterpretation({ interpretation }: SoulInterpretationProps) {
  const { toast } = useToast();

  const getTraitIcon = (iconName: string) => {
    switch (iconName) {
      case "lightbulb":
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case "eye":
        return <Eye className="w-5 h-5 text-blue-400" />;
      case "layers":
        return <Layers className="w-5 h-5 text-purple-400" />;
      case "heart":
        return <Heart className="w-5 h-5 text-rose-400" />;
      case "star":
        return <Star className="w-5 h-5 text-yellow-400" />;
      case "moon":
        return <Moon className="w-5 h-5 text-indigo-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-primary" />;
    }
  };

  const shareResults = async () => {
    const shareText = `${interpretation.title}\n\n${interpretation.description}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Shadow Soul Reading",
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to Clipboard",
          description: "Your soul reading has been copied to the clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share Error",
          description: "Unable to share your reading.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h3 className="text-2xl font-light text-foreground mb-2">Soul Silhouette</h3>
        <p className="text-sm text-muted-foreground font-light">What your shadow reveals</p>
      </div>

      <Card className="minimal-card bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200/20 dark:border-purple-800/20">
        <CardContent className="p-10">
          <div className="space-y-8">
            <div className="text-center">
              <h4 className="text-2xl font-light text-foreground mb-6">{interpretation.title}</h4>
              <div className="w-20 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
            </div>
            
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-foreground/80 leading-relaxed text-lg font-light">
                {interpretation.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {interpretation.traits.map((trait, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-200/30 dark:border-purple-800/30">
                    {getTraitIcon(trait.icon)}
                  </div>
                  <h5 className="font-light text-foreground mb-2 text-lg">{trait.name}</h5>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{trait.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Results */}
      <div className="text-center">
        <Button 
          onClick={shareResults}
          variant="outline"
          className="px-8 py-3 border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30 rounded-full font-light"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Reading
        </Button>
      </div>
    </div>
  );
}