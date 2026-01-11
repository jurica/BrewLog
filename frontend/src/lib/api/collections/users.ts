import { logout } from "../auth";
import { pb } from "../client";
import { Response, PB_Record } from "./common.svelte";

export namespace Users {
    const collectionName = "users";
    export interface Record extends PB_Record {
        email: string;
        firstname: string;
        lastname: string;
        avatar: string;
    }

    export function getList(): Response<Record[]> {
        const resp = new Response<Record[]>();

        (async function () {
            resp.loading = true;
            try {
                resp.data = (
                    await pb
                        .collection(collectionName)
                        .getList<Record>(1, 30, {
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
                    .getOne<Record>(id);
            } finally {
                resp.loading = false;
            }
        })();

        return resp;
    }

    export function getCurrentUser(): Response<Record> {
        const resp = new Response<Record>();

        (async function () {
            resp.loading = true;
            try {
                resp.data = await pb
                    .collection(collectionName)
                    .getOne<Record>(pb.authStore.record?.id);
            } catch {
                resp.loading = false;
                resp.error = "Current User not found or set.";
                logout();
            } finally {
                resp.loading = false;
            }
        })();

        return resp;
    }
}
