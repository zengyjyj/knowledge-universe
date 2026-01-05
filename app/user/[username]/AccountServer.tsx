"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateUsernameQuery } from "@/data/queries/profilesServer";
import { logout } from "@/data/queries/profilesBrowser";

export async function updateUsernameAction(
  formData: FormData,
  oldUsername: string
) {
  const newUsername = formData.get("newUsername")?.toString();

  if (!newUsername) {
    throw new Error("用户名不能为空");
  }

  if (newUsername == oldUsername) {
    throw new Error("新用户名不能与旧用户名相同");
  }
  await updateUsernameQuery(newUsername);

  revalidatePath(`/user`);
  redirect(`/user`);
}

export async function logoutAction() {
  await logout();
  redirect("/user");
}
