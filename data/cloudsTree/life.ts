import { TreeNode } from "./types";

export const lifeTree: TreeNode = {
  id: "life",
  title: "生存与生活",
  children: [
    {
      id: "health-care",
      title: "健康与医疗",
      children: [
        {
          id: "preventive-medicine",
          title: "预防医学（体检）",
          children: [
            {
              id: "elder-health-check",
              title: "中老年人体检",
            },
            {
              id: "younger-health-check",
              title: "年轻人体检",
            },
          ],
        },
        {
          id: "medications-treatments",
          title: "药品与治疗",
          children: [
            {
              id: "doliprane",
              title: "止法国痛药",
            },
            {
              id: "fever",
              title: "退烧药",
            },
          ],
        },
        {
          id: "medical-treatment-process",
          title: "就医流程",
          children: [
            {
              id: "CT",
              title: "拍CT片",
            },
          ],
        },
      ],
    },
    {
      id: "diet-nutrition",
      title: "饮食与营养",
      children: [
        {
          id: "nutritionalknowledge",
          title: "营养知识",
          children: [
            {
              id: "protein",
              title: "蛋白质",
            },
          ],
        },
        {
          id: "understanding-foods",
          title: "食材理解",
          children: [
            {
              id: "meal-control-weight",
              title: "减脂餐",
            },
          ],
        },
      ],
    },
  ],
};
