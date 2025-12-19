import { supabase } from "@/lib/supabase";
import type { Cloud } from "../types/database";

export async function getAllClouds(): Promise<Cloud[]> {
  const { data, error } = await supabase.from("clouds").select("*").order("id");

  if (error) throw error;
  return data as Cloud[];
}
