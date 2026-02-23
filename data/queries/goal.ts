import { supabase } from "@/lib/supabase/supabaseBrowser";
import { Goal, GoalLite } from "../types/database";

/**SELECT DISTINCT
        g.id,
        gn.node_id,
        g.title,
        g.introduction
    FROM public.subcategories sc
    JOIN public.nodes n      ON n.subcategory_id = sc.id
    JOIN public.goal_node gn ON gn.node_id = n.id
    JOIN public.goal g       ON g.id = gn.goal_id
    WHERE sc.category_id = ???
        AND n.status = 'published'
        AND g.status = 'published';
   */
//return Map<subCategoryId,GoalLite[]>
export async function getGoalsByCategoryId(
  categoryId: number,
): Promise<Map<number, GoalLite[]>> {
  const { data, error } = await supabase
    .from("subcategories")
    .select(
      `
      id,
      nodes!inner (
        status,
        goal_node!inner (
          node_id,
          goal!inner (
            id,
            title,
            introduction,
            status,
            difficulty
          )
        )
      )
    `,
    )
    .eq("category_id", categoryId)
    .eq("nodes.status", "published")
    .eq("nodes.goal_node.goal.status", "published");

  if (error) throw error;

  const map = new Map<number, GoalLite[]>();

  for (const sc of data ?? []) {
    const subId = Number(sc.id);
    const goals: GoalLite[] = [];

    const nodes = (sc as any).nodes ?? [];
    for (const n of nodes) {
      const gns = n.goal_node ?? [];
      for (const gn of gns) {
        const g = gn.goal;
        if (g && g.status === "published") {
          goals.push({
            id: g.id,
            nodeId: gn.node_id,
            title: g.title ?? null,
            introduction: g.introduction ?? null,
            difficulty: g.difficulty ?? null,
          });
        }
      }
    }

    // 去重（同 goal 可能被多个 node 关联）
    const unique = Array.from(new Map(goals.map((g) => [g.id, g])).values());
    map.set(subId, unique);
  }

  return map;
}

export async function getGoalsByNodeId(nodeId: number): Promise<Goal[]> {
  const { data, error } = await supabase
    .from("goal_node")
    .select(
      `
      goal!inner (
        id,
        title,
        introduction,
        difficulty,
        description,
        period,
        information,
        status
      )
    `,
    )
    .eq("node_id", nodeId)
    .eq("goal.status", "published");

  if (error) throw error;

  if (!data) return [];

  const goals = data.map((row: any) => row.goal);

  return goals;
}
