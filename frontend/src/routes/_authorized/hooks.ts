import type { Hooks } from "sv-router";
import { navigate } from "sv-router/generated";
import { isAuthenticated } from "$lib/api";

export default {
  async beforeLoad() {
    if (!isAuthenticated()) {
      throw navigate("/login");
    }
  }
} satisfies Hooks;
