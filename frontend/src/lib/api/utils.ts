import {
    CalendarDate,
    toCalendarDate as i_toCalendarDate,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
  CalendarDateTime,
} from "@internationalized/date";

export function toCalendarDate(value: string) : CalendarDate {
    const date = parseAbsoluteToLocal(value.replace(" ", "T"));
    return i_toCalendarDate(date);
}

export function fromCalendarDate(cd: CalendarDate) {
    console.log(cd);
    return cd.toString().replace("T", " ");
    // return toCalendarDateTime(cd).toString().replace("T", " ");
}

