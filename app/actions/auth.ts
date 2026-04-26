"use server";

import { signIn as authSignIn, signOut as authSignOut } from "@/lib/auth";

export async function handleSignIn(provider?: string) {
  await authSignIn(provider);
}

export async function handleSignOut() {
  await authSignOut();
}
