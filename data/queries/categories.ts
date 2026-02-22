import { supabase } from "@/lib/supabase/supabaseBrowser";
import { Category } from "../types/database";

export async function getCategoriesByCloudName(
  cName: string,
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      clouds!inner (
        name
      )
    `,
    )
    .eq("clouds.name", cName);

  if (error) throw error;

  return data as Category[];
}

// Map<cloudId, Category[]>
export async function getCategoriesMapByCloudId(): Promise<
  Map<number, Category[]>
> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  if (error) throw error;

  const map = new Map<number, Category[]>();

  for (const cat of data as Category[]) {
    const cloudId = cat.cloud_id;
    map.has(cloudId) ? map.get(cloudId)?.push(cat) : map.set(cloudId, [cat]);
  }

  return map;
}
