import { TreeNode } from "./types";

export const growthTree: TreeNode = {
  id: "growth",
  title: "学习与知识系统",
  children: [
    {
      id: "system",
      title: "学科体系",
      children: [
        {
          id: "mathematics",
          title: "数学",
          children: [],
        },
        {
          id: "physics",
          title: "物理",
          children: [],
        },
        {
          id: "psychology",
          title: "心理学",
          children: [],
        },
      ],
    },
    {
      id: "technical-skills",
      title: "技术技能",
      children: [
        {
          id: "programming",
          title: "编程",
          children: [],
        },
        {
          id: "network",
          title: "网络",
          children: [],
        },
        {
          id: "AI",
          title: "AI",
          children: [],
        },
      ],
    },
    {
      id: "professional-abilities",
      title: "职业能力",
      children: [
        {
          id: "finance",
          title: "金融",
          children: [],
        },
        {
          id: "law",
          title: "法律",
          children: [],
        },
        {
          id: "business",
          title: "商业",
          children: [],
        },
      ],
    },
  ],
};
