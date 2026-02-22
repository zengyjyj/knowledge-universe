import { supabase } from "@/lib/supabase/supabaseBrowser";
import { SubCategory } from "../types/database";

//Map<categoryId, SubCategory[]>
export async function getSubCategoriesMapByCatId(): Promise<
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

export async function getSubCategoryByName(
  subName: string,
): Promise<SubCategory> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("name", subName)
    .single();

  if (error) throw error;

  return data as SubCategory;
}
