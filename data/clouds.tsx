import { Heart, Book, Star, User, Globe } from "lucide-react";
import { JSX } from "react";

//cloudsVisual
export const cloudIcons: Record<string, JSX.Element> = {
  life: <Heart className="w-7 h-7 text-red-300" />,
  learning: <Book className="w-7 h-7 text-blue-300" />,
  skill: <Star className="w-7 h-7 text-yellow-300" />,
  growth: <User className="w-7 h-7 text-green-300" />,
  world: <Globe className="w-7 h-7 text-purple-300" />,
};

export const cloudColors: Record<string, string> = {
  life: "rgb(210, 109, 109)",
  learning: "rgb(100,150,255 )",
  skill: "rgba(255, 219, 100, 0.82)",
  growth: "rgba(81, 220, 22, 0.78)",
  world: "rgba(199, 110, 217, 0.85)",
};

export function withOpacity(color: string, opacity: number) {
  if (color.startsWith("rgba")) {
    return color.replace(
      /rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/,
      `rgba($1,$2,$3,${opacity})`
    );
  }

  if (color.startsWith("rgb")) {
    return color.replace("rgb", "rgba").replace(")", `, ${opacity})`);
  }

  return color;
}
