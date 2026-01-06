// path: data/queries/favoriteNodeServer.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Node } from "../types/database";

export async function getFavoriteNodeState(nodeId: number) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return {
      loggedIn: false,
      favorited: false,
    };
  }

  const favorited = await supabase
    .from("favoriteNode")
    .select("node_id")
    .eq("node_id", nodeId)
    .eq("profile_id", user.id)
    .maybeSingle();

  return {
    loggedIn: true,
    favorited: favorited?.data ? true : false,
  };
}

export async function toggleFavoriteNode(nodeId: number, favorited: boolean) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("NOT_LOGGED_IN");
  }

  try {
    if (favorited) {
      const { error } = await supabase
        .from("favoriteNode")
        .delete()
        .eq("node_id", nodeId)
        .eq("profile_id", user.id);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("favoriteNode").insert({
        node_id: nodeId,
        profile_id: user.id,
      });

      if (error) throw error;
    }
  } catch (error) {
    throw new Error("TOGGLE_FAVORITE_FAILED" + error);
  }
  return !favorited;
}

export async function getFavoriteNodeByUserQuery(): Promise<Node[]> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    return [];
  }

  const { data: favorites, error: favError } = await supabase
    .from("favoriteNode")
    .select("node_id")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  if (favError || !favorites?.length) {
    return [];
  }

  const nodeIds = favorites.map((f) => f.node_id);
  const { data: nodes, error: nodeError } = await supabase
    .from("nodes")
    .select("*")
    .in("id", nodeIds);
  if (nodeError) {
    throw nodeError;
  }
  return (nodes as Node[]) || [];
}
