import { supabase } from "@/lib/supabase";
import type { Node } from "../types/database";

export async function getNodesBySubCategoryId(
  subCategory_id: number
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
  subCategoryName: string
): Promise<Node[]> {
  const { data, error } = await supabase
    .from("nodes")
    .select(
      `
      *,
      subcategories!inner (
        name
      )
    `
    )
    .eq("subcategories.name", subCategoryName);

  if (error) throw error;

  return data as Node[];
}
