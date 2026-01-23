import { pb } from "../client";

export interface PB_Record {
  id: string;
  readonly collectionName: string;
  created: string;
  updated: string;
}

export class Response<Type extends PB_Record | PB_Record[]> {
  data: Type = $state();
  error = $state();
  loading = $state(false);
  page = $state(0);
  perPage = $state(0);
  totalItems = $state(0);
  totalPages = $state(0);
}

export async function persistRecord<T extends PB_Record>(
  collectionName: string,
  record: T
): Promise<T> {
  if (record.id.length > 0) {
    return pb.collection(collectionName).update<T>(record.id, record);
  } else {
    return pb.collection(collectionName).create<T>(record);
  }
}
