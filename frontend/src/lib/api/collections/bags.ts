import { pb } from "../client";
import { Response, PB_Record } from "./common.svelte";
import { Bean } from "./beans";
import { CalendarDate, CalendarDateTime, ZonedDateTime, parseAbsoluteToLocal } from "@internationalized/date";
import { fromCalendarDate, toCalendarDate } from "../utils";

export class Bag {
    private _bag: Bag.Record;

    constructor(record: Bag.Record) {
        this._bag = record;
    }

    public get roastDate() : ZonedDateTime {
        return parseAbsoluteToLocal(this._bag.roast_date.replace(" ", "T"));
    }
    
    public set roastDate(newDate : ZonedDateTime) {
        this._bag.roast_date = newDate.toAbsoluteString().replace("T", " ");
    }
}

export namespace Bag {
    const collectionName = "bags";
    export interface Record extends PB_Record {
        initial_weight_g: number;
        opened_date?: string;
        finished_date?: string;
        leftover_amount_g?: number;
        price?: number;
        currency?: string;
        roast_date?: string;
        expand: {
            bean: Bean.Record;
        };
    }
    export type Filters = "opened" | "all" | "unopened" | "finished";
    export type FilterValues<T> = { [key in Filters]: T };
    export const FilterQueries: FilterValues<string> = {
        opened: "opened_date != '' && finished_date = ''",
        all: "",
        unopened: "opened_date = ''",
        finished: "finished_date != ''"
    };

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
