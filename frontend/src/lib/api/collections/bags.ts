import { pb } from "../client";
import { Response, PB_Record } from "./common.svelte";
import { Bean } from "./beans";
import { ZonedDateTimeProxy } from "../utils";

export namespace Bag {
    const collectionName = "bags";
    export interface Record extends PB_Record {
        initial_weight_g: number;
        roast_date: string;
        purchase_date: string;
        open_date: string;
        finish_date: string;
        leftover_amount_g: number;
        price: number;
        currency: string;
        expand: {
            bean: Bean.Record;
        };
        bean: string;
    }
    export type Filters = "opened" | "all" | "unopened" | "finished";
    export type FilterValues<T> = { [key in Filters]: T };
    export const FilterQueries: FilterValues<string> = {
        opened: "open_date != '' && finish_date = ''",
        all: "",
        unopened: "open_date = ''",
        finished: "finish_date != ''"
    };

    export function getRoastDateZonedDateTimeProxy(record: Record) : ZonedDateTimeProxy<Record> {
        return new ZonedDateTimeProxy<Record>(record, "roast_date");
    }

    export function getOpenDateZonedDateTimeProxy(record: Record) : ZonedDateTimeProxy<Record> {
        return new ZonedDateTimeProxy<Record>(record, "open_date");
    }

    export function getFinishDateZonedDateTimeProxy(record: Record) : ZonedDateTimeProxy<Record> {
        return new ZonedDateTimeProxy<Record>(record, "finish_date");
    }

    export function getPurchaseDateZonedDateTimeProxy(record: Record) : ZonedDateTimeProxy<Record> {
        return new ZonedDateTimeProxy<Record>(record, "purchase_date");
    }

    export function newRecord(): Record {
        const bag: Record = {
            id: "",
            collectionName: collectionName,
            updated: "",
            created: "",
            bean: "",
            finish_date: "",
            roast_date: "",
            currency: "EUR",
            leftover_amount_g: 0,
            price: 0.00,
            initial_weight_g: 250,
            open_date: "",
            purchase_date: "",
            expand: {
                bean: Bean.newRecord()
                }
            };

        return bag;
    }

    export function getList(filter: Filters): Response<Record[]> {
        const resp = new Response<Record[]>();

        (async function () {
            resp.loading = true;
            try {
                resp.data = (
                    await pb
                        .collection(collectionName)
                        .getList<Record>(1, 30, {
                            expand: "bean,bean.roaster",
                            filter: FilterQueries[filter],
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
                    .getOne<Record>(id, { expand: "bean.roaster" });
            } finally {
                resp.loading = false;
            }
        })();

        return resp;
    }
}
