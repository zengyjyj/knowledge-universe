import { supabase } from "@/lib/supabase";
import type { Categories } from "../types/database";

export async function getAllCategories(): Promise<Categories[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  if (error) throw error;
  return data as Categories[];
}
