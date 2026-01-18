import { pb } from "./client";

export async function login(email: string, password: string) {
  try {
    await pb.collection("users").authWithPassword(email, password);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logout() {
  pb.authStore.clear();
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}
