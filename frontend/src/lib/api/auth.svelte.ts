import { pb } from "./client";
import { Users } from "./collections/users";
import _ from "lodash";

export async function login(email: string, password: string) {
  try {
    await pb.collection("users").authWithPassword(email, password);
    await init();
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logout() {
  pb.authStore.clear();
  _.merge(currentUser, Users.newRecord());
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

export let currentUser: Users.Record = $state<Users.Record>(Users.newRecord());

export async function init() {
  if (pb.authStore.isValid && pb.authStore.record?.id) {
    try {
      let user = await pb.collection(currentUser.collectionName).getOne<Users.Record>(pb.authStore.record.id);
      if (user.uiState === null) {
        user.uiState = currentUser.uiState;
      }
      _.merge(currentUser, user);
    } catch {
      logout();
    }
  } else {
    logout();
  }
}

