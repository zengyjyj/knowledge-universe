import { elderHealthCheck } from "./elder-health-check";
import { youngerHealthCheck } from "./younger-health-check";

//struct of node content
export type NodeContent = {
  id: string;
  title: string;
  description: string;
};

//all indexs (all nodes)
export type NodeKey = keyof typeof NODES;
export const NODES = {
  "elder-health-check": elderHealthCheck,
  "younger-health-check": youngerHealthCheck,
};
