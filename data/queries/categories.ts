import { supabase } from "@/lib/supabase";
import { Category } from "../types/database";

export async function getCategoriesByCloudName(
  cName: string
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      clouds!inner (
        name
      )
    `
    )
    .eq("clouds.name", cName);

  if (error) throw error;

  return data as Category[];
}
