import { supabase } from "@/lib/supabase";
import type { Cloud } from "../types/database";

export async function getAllClouds(): Promise<Cloud[]> {
  const { data, error } = await supabase.from("clouds").select("*").order("id");

  if (error) throw error;
  return data as Cloud[];
}

export async function getAllCloudsMap(): Promise<Map<string, Cloud>> {
  const { data, error } = await supabase.from("clouds").select("*").order("id");

  if (error) throw error;
  const map = new Map<string, Cloud>();
  for (const cloud of data as Cloud[]) {
    map.set(cloud.name, cloud);
  }

  return map;
}
