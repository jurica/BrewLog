import { pb } from "../client";
import { Response, PB_Record } from "./common.svelte";

export namespace Roaster {
  const collectionName = "roasters";
  export interface Record extends PB_Record {
    name: string;
    website?: string;
    picture?: string;
  }

  export function newRecord(): Record {
    const roaster: Record = {
      id: "",
      collectionName: collectionName,
      updated: "",
      created: "",
      name: "",
      website: "",
      picture: ""
    };
    return roaster;
  }

  export function getList(): Response<Record[]> {
    const resp = new Response<Record[]>();

    (async function () {
      resp.loading = true;
      try {
        resp.data = (
          await pb.collection(collectionName).getList<Record>(1, 30, {})
        ).items;
      } finally {
        resp.loading = false;
      }
    })();

    return resp;
  }

  export function getOne(id: string): Response<Record> {
    const resp = new Response<Record>();

    (async function () {
      resp.loading = true;
      try {
        resp.data = await pb.collection(collectionName).getOne<Record>(id);
      } finally {
        resp.loading = false;
      }
    })();

    return resp;
  }
}
