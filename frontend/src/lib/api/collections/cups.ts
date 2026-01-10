import { pb } from "../client";
import { Response, PB_Record } from "./common.svelte";
import { Bag } from "./bags";

export namespace Cups {
    const collectionName = "cups";
    export interface Record extends PB_Record {
        used_coffee_g?: number;
        yield_g?: number;
        water_temp_c?: number;
        brew_time_s: number;
        pictures: string[];
        rating?: number;
        notes?: string;
        expand: {
            bag: Bag.Record;
        };
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
}
