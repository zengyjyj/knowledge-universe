import { supabase } from "@/lib/supabase/browser";
import type { GuideNode, Node, NodePath } from "../types/database";

export async function getNodeDetailById(nodeId: number): Promise<{
  node: Node;
  nodePath: NodePath;
}> {
  const { data, error } = await supabase
    .from("nodes")
    .select(
      `
      *,
      subcategories!inner (name,title,
        categories!inner (name,title,
          clouds!inner (name,title
          )
        )
      ) `,
    )
    .eq("id", nodeId)
    .single();

  if (error) throw error;

  return {
    node: {
      id: data.id,
      title: data.title,
      definition: data.definition,
      detail: data.detail,
      subCategory_id: data.subcategory_id,
    } as Node,
    nodePath: {
      subName: data.subcategories.name,
      subTitle: data.subcategories.title,
      catName: data.subcategories.categories.name,
      catTitle: data.subcategories.categories.title,
      cName: data.subcategories.categories.clouds.name,
      cTitle: data.subcategories.categories.clouds.title,
    } as NodePath,
  };
}

export async function getNodesBySubCategoryId(
  subCategory_id: number,
): Promise<Node[]> {
  const { data, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("subcategory_id", subCategory_id)
    .order("id");

  if (error) throw error;
  return data as Node[];
}

export async function getNodesBySubCategoryName(
  subCategoryName: string,
): Promise<Node[]> {
  const { data, error } = await supabase
    .from("nodes")
    .select(
      `
      *,
      subcategories!inner (
        name
      )
    `,
    )
    .eq("subcategories.name", subCategoryName);

  if (error) throw error;

  return data as Node[];
}

//return the guide nodes for all clouds, grouped by cloud name
export async function getGuideNodes(): Promise<Map<string, GuideNode[]>> {
  const { data, error } = await supabase.from("nodes").select(`
      id,
      question,
      definition,
      subcategories!inner (
        categories!inner (
          clouds!inner (
            name
          )
        )
      )
    `);

  if (error) throw error;

  const result = new Map<string, GuideNode[]>();

  for (const node of data) {
    const cloudName = node.subcategories?.categories?.clouds?.name;

    if (!cloudName) continue;

    if (!result.has(cloudName)) result.set(cloudName, []);

    result.get(cloudName)!.push({
      id: node.id,
      question: node.question,
      definition: node.definition,
    });
  }
  return result;
}
