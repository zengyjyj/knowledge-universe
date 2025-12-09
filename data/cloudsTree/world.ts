import { TreeNode } from "./types";

export const worldTree: TreeNode = {
  id: "learning",
  title: "世界与系统",
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
  ],
};
