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
}
