"use server";

//path: app/node/[nodeId]/nodeActions.ts
import {
  toggleFavoriteNode,
  getFavoriteNodeState,
} from "@/data/queries/favoriteNodeServer";

export async function getNodeState(nodeId: number) {
  return await getFavoriteNodeState(nodeId);
}

export async function toggleFavoriteNodeAction(
  nodeId: number,
  favorited: boolean
) {
  return await toggleFavoriteNode(nodeId, favorited);
}
