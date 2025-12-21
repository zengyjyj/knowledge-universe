import { supabase } from "@/lib/supabase";
import { Category } from "../types/database";

export async function getAllCategoriesMap(): Promise<Map<number, Category[]>> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  if (error) throw error;
  const map = new Map<number, Category[]>();

  for (const category of data as Category[]) {
    const cloudId = category.cloud_id;

    map.has(cloudId)
      ? map.get(cloudId)!.push(category)
      : map.set(cloudId, [category]);
  }

  return map;
}
