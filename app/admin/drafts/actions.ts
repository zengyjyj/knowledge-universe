"use server";

import {
  getNodeDrafts,
  deleteNodeDraft,
  publishNodeDraft,
} from "@/data/queries/nodesDraft";
import { getSubCategoriesName } from "@/data/queries/subCategories";

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
