import { elderHealthCheck } from "./elder-health-check";
import { youngerHealthCheck } from "./younger-health-check";
import { elderHealthCheck2 } from "./elder-health-check2";
//struct of node content
export type NodeContent = {
  id: string;
  title: string;
  description: string;
  cloud: string;
};

//all indexs (all nodes)
export type NodeKey = keyof typeof NODES;
export const NODES = {
  "elder-health-check": elderHealthCheck,
  "younger-health-check": youngerHealthCheck,
  "elder-health-check2": elderHealthCheck2,
};
