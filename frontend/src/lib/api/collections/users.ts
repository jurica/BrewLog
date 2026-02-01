import { Bags } from "./bags";
import { PB_Record, persistRecord } from "./common.svelte";
import { Cups } from "./cups";
import { locales } from "$lib/locales";

export type Locale = (typeof locales)[number];

export namespace Users {
  const collectionName = "users";
  export interface Record extends PB_Record {
    email: string;
    firstname: string;
    lastname: string;
    avatar: string;
    uiState: UiState;
  }

  interface UiState {
    locale: Locale;
    bags: Bags.UiState;
    cups: Cups.UiState;
  }

  export function newRecord(): Record {
    const user: Record = {
      id: "",
      collectionName: collectionName,
      updated: "",
      created: "",
      email: "",
      firstname: "",
      lastname: "",
      avatar: "",
      uiState: {
        locale: "en",
        bags: {
          filter: "opened",
          view: "grid"
        },
        cups: {
          page: 1
        }
      }
    };
    return user;
  }

  export async function persist(record: Record): Promise<Record> {
    return persistRecord(collectionName, record);
  }

  let debounceTimeout: ReturnType<typeof setTimeout>;
  export async function persistDebounced(record: Record, delay: number = 1000) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      persistRecord(collectionName, record);
    }, delay);
  }
}
