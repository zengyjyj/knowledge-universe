"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateUsernameQuery } from "@/data/queries/profilesServer";
import { logoutQuery } from "@/data/queries/profilesServer";

export async function updateUsernameAction(
  formData: FormData,
  oldUsername: string
) {
  const newUsername = formData.get("newUsername")?.toString();

  if (!newUsername) {
    return { error: "用户名不能为空" };
  }

  if (newUsername == oldUsername) {
    return { error: "新用户名不能与旧用户名相同" };
  }
  await updateUsernameQuery(newUsername);

  revalidatePath(`/user`);
  redirect(`/user`);
}

export async function logoutAction() {
  console.log("Logging out..............");
  await logoutQuery();

  // 清空所有依赖 auth 的缓存
  revalidatePath("/", "layout");
  revalidatePath("/user");

  redirect("/user");
}
