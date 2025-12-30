import { supabase } from "@/lib/supabase/browser";
import type { Cloud } from "../types/database";

export async function getAllClouds(): Promise<Cloud[]> {
  const { data, error } = await supabase.from("clouds").select("*").order("id");

  if (error) throw error;
  return data as Cloud[];
}

export async function getCloudByName(cloudName: string): Promise<Cloud> {
  const { data, error } = await supabase
    .from("clouds")
    .select("*")
    .eq("name", cloudName)
    .single();

  if (error) throw error;

  return data as Cloud;
}
