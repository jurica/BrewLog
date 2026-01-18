import { pb } from "../client";
import { Response, PB_Record } from "./common.svelte";
import { Bags } from "./bags";

export namespace Cups {
  const collectionName = "cups";
  export interface Record extends PB_Record {
    used_coffee_g: number;
    yield_g: number;
    water_temp_c: number;
    brew_time_s: number;
    pictures: (string | File)[];
    rating: number;
    notes: string;
    bag: string;
    expand: {
      bag: Bags.Record;
    };
  }

  export function newRecord(): Record {
    const record: Record = {
      id: "",
      collectionName: collectionName,
      updated: "",
      created: "",
      used_coffee_g: 7,
      yield_g: 25,
      water_temp_c: 90,
      brew_time_s: 30,
      pictures: [],
      rating: 0,
      notes: "",
      bag: "",
      expand: {
        bag: Bags.newRecord()
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
          await pb
            .collection(collectionName)
            .getList<Record>(1, 30, { expand: "bag.bean.roaster" })
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
          .getOne<Record>(id, { expand: "bag.bean.roaster" });
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
