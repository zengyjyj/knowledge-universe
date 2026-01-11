export type HomeCard = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  route: string;
  iconKey: "compass" | "target" | "message";
  scanColor: string;
  borderColor: string;
};

export const homeCards: HomeCard[] = [
  {
    id: 1,
    title: "Explore",
    subtitle: "探索模式",
    description: "自由浏览结构化知识网络，发现意想不到的关联与洞见。",
    route: "/explore",
    iconKey: "compass",
    scanColor: "rgba(59,130,246,0.1)",
    borderColor:
      "hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.8)]",
  },
  {
    id: 2,
    title: "Path",
    subtitle: "目标模式",
    description: "围绕你的目标生成循序渐进的学习路径。",
    route: "/goal",
    iconKey: "target",
    scanColor: "rgba(74,222,128,0.1)",
    borderColor:
      "hover:border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.8)]",
  },
  {
    id: 3,
    title: "Ask",
    subtitle: "即问即答",
    description: "随时发问，获得结构化的即时知识卡与解释。",
    route: "/ask",
    iconKey: "message",
    scanColor: "rgba(168,85,247,0.1)",
    borderColor:
      "hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.8)]",
  },
];
