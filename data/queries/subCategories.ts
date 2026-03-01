import { supabase } from "@/lib/supabase/supabaseBrowser";
import { SubCategory, SubCategoryTitle } from "../types/database";

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

//categoryName  ->  SubCategory
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

//categoryId  ->  SubCategory
export async function getSubCategoriesByCatId(
  categoryId: number,
): Promise<SubCategory[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId)
    .order("id");

  if (error) throw error;

  return data as SubCategory[];
}

export async function getSubCategoriesName(): Promise<SubCategoryTitle[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("id,title");

  if (error) throw error;

  return data as SubCategoryTitle[];
}
