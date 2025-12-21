import { supabase } from "@/lib/supabase";
import { SubCategory } from "../types/database";

export async function getAllSubCategoriesMap(): Promise<
  Map<number, SubCategory[]>
> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .order("id");

  if (error) throw error;

  const map = new Map<number, SubCategory[]>();

  for (const subCategory of data as SubCategory[]) {
    const categoryId = subCategory.category_id;

    map.has(categoryId)
      ? map.get(categoryId)!.push(subCategory)
      : map.set(categoryId, [subCategory]);
  }

  return map;
}
