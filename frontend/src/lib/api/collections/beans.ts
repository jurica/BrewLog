import { pb } from "../client";
import { Response, PB_Record } from "./common.svelte";
import { Roaster } from "./roasters";

export namespace Bean {
  const collectionName = "beans";
  export interface Record extends PB_Record {
    picture: string | File;
    roaster: string;
    name: string;
    expand: {
      roaster: Roaster.Record;
    };
  }

  export function newRecord(): Record {
    const record: Record = {
      id: "",
      collectionName: collectionName,
      updated: "",
      created: "",
      name: "",
      picture: "",
      roaster: "",
      expand: {
        roaster: Roaster.newRecord()
      }
    };
    return record;
  }

  export function getList(): Response<Record[]> {
    const resp = new Response<Record[]>();

    (async function () {
      resp.loading = true;
      try {
        resp.data = (
          await pb.collection(collectionName).getList<Record>(1, 30, {
            expand: "roaster"
          })
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
        resp.data = await pb
          .collection(collectionName)
          .getOne<Record>(id, { expand: "roaster" });
      } finally {
        resp.loading = false;
      }
    })();

    return resp;
  }

  export async function persist(record: Record): Promise<Record> {
    if (record.id.length > 0) {
      return pb.collection(collectionName).update<Record>(record.id, record);
    } else {
      return pb.collection(collectionName).create<Record>(record);
    }
  }
}
