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
  skill: "rgb(255,220,100 )",
  growth: "rgb(35, 220, 22 )",
  world: "rgb(212, 51, 172 )",
};

export function withOpacity(color: string, opacity: number) {
  return color.replace("rgb", "rgba").replace(")", `, ${opacity})`);
}
