"use server";

import {
  getNodeDrafts,
  deleteNodeDraft,
  publishNodeDraft,
} from "@/data/queries/nodesDraft";
import { logoutQuery } from "@/data/queries/profilesServer";
import { getSubCategoriesName } from "@/data/queries/subCategories";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function fetchNodeDrafts() {
  return await getNodeDrafts();
}

export async function fetchSubcategories() {
  return await getSubCategoriesName();
}

export async function removeDraft(id: number) {
  return await deleteNodeDraft(id);
}

export async function publishDraft(payload: {
  draftId: number;
  title: string;
  definition: string;
  question: string;
  ai_answer: string;
  subcategoryName: string;
  subcategoryId: number;
}) {
  return await publishNodeDraft(payload);
}

export async function logoutAction() {
  await logoutQuery();

  revalidatePath("/", "layout");
  revalidatePath("/user");

  redirect("/user");
}
