import {
  ZonedDateTime,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  toZoned
} from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { PB_Record } from "./collections/common.svelte";
import { pb } from "./client";

export class ZonedDateTimeProxy<T extends PB_Record> {
  private _record: T;
  private _property: keyof T;

  constructor(record: T, propery: keyof T) {
    this._record = record;
    this._property = propery;
  }

  public get value(): ZonedDateTime | undefined {
    const stringValue = this._record[this._property] as string;
    if (stringValue === undefined || stringValue.length === 0) return undefined;
    return parseAbsoluteToLocal(stringValue.replace(" ", "T"));
  }

  public set value(newDate: DateValue) {
    if (newDate === undefined) return;
    newDate = toZoned(newDate, getLocalTimeZone());
    this._record[this._property] = newDate
      .toAbsoluteString()
      .replace("T", " ") as T[keyof T];
  }

  public toString(): string {
    if (this.value === undefined) return "";
    return this.value.toDate().toLocaleDateString();
  }
}

export function getURL(record: PB_Record, file: string) : string {
  return pb.files.getURL(record, file);
}
