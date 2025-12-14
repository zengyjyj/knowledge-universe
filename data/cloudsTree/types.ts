import { lifeTree } from "./life";
import { learnTree } from "./learning";
import { worldTree } from "./world";
import { growthTree } from "./growth";
import { skillTree } from "./skill";

//struct of menu (多级分类目录)
export type TreeNode = {
  id: string;
  title: string;
  children?: TreeNode[];
};
export const TREES = {
  life: lifeTree,
  learning: learnTree,
  world: worldTree,
  growth: growthTree,
  skill: skillTree,
};
