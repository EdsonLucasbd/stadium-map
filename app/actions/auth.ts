"use server";

import { signIn as authSignIn, signOut as authSignOut } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function handleSignIn(provider?: string) {
  await authSignIn(provider);
}

export async function handleSignOut() {
  await authSignOut();
  revalidatePath("/");
  redirect("/");
}
