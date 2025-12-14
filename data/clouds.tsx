import { Heart, Book, Star, User, Globe } from "lucide-react";
import { JSX } from "react";

// 五大云基础信息
export const CLOUDS = {
  life: {
    title: "生存与生活",
    description: "你的身体、日常与安全",
  },
  learning: {
    title: "学习与知识",
    description: "理解世界的基础框架",
  },
  skill: {
    title: "能力与技能",
    description: "做事与解决问题的能力",
  },
  growth: {
    title: "自我与成长",
    description: "认知自己、持续进化",
  },
  world: {
    title: "世界与系统",
    description: "社会、规则与宏观结构",
  },
};

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
