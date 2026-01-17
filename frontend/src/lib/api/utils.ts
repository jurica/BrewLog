import {
  ZonedDateTime,
  CalendarDate,
  toCalendarDate as i_toCalendarDate,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  CalendarDateTime,
  toZoned,
} from "@internationalized/date";
  import type { DateValue } from "@internationalized/date";
import { PB_Record } from "./collections/common.svelte";

export function toCalendarDate(value: string) : CalendarDate {
  const date = parseAbsoluteToLocal(value.replace(" ", "T"));
  return i_toCalendarDate(date);
}

export function fromCalendarDate(cd: CalendarDate) {
  console.log(cd);
  return cd.toString().replace("T", " ");
  // return toCalendarDateTime(cd).toString().replace("T", " ");
}

export class ZonedDateTimeProxy<T extends PB_Record> {
  private _record: T;
  private _property: keyof T;

  constructor(record: T, propery: keyof T) {
    this._record = record;
    this._property = propery;
  }

  public get value(): ZonedDateTime {
    const stringValue = this._record[this._property] as string;
        if (stringValue === undefined || stringValue.length === 0) return undefined;
    return parseAbsoluteToLocal(stringValue.replace(" ", "T"));
  }

  public set value(newDate: DateValue) {
    //     console.log(this._property);
    if (newDate === undefined) return;
        newDate = toZoned(newDate, getLocalTimeZone());
    //     console.log(newDate.toString());
    this._record[this._property] = newDate.toAbsoluteString().replace("T", " ") as typeof T[keyof T];
  }

  public toString() : string {
    if (this.value === undefined) return "";
    return this.value.toDate().toLocaleDateString()
  }
}
