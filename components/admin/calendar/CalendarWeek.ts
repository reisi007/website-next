import * as dayjs from 'dayjs';
import isoWeekPlugin from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeekPlugin);

export class CalendarWeek {
  private internalWeek: dayjs.Dayjs;

  constructor(
    date: dayjs.Dayjs,
  ) {
    this.internalWeek = date
      .isoWeekday(1); // Monday
  }

  format(format: string = 'DD.MM.YYYY'): string {
    return this.internalWeek.format(format);
  }

  next(): CalendarWeek {
    return new CalendarWeek(this.internalWeek.add(1, 'week'));
  }

  prev(): CalendarWeek {
    return new CalendarWeek(this.internalWeek.add(-1, 'week'));
  }

  equals(other: CalendarWeek): boolean {
    return this.internalWeek.year() === other.internalWeek.year()
           && this.internalWeek.isoWeek() === other.internalWeek.isoWeek();
  }

  id(): string {
    return this.internalWeek.year().toString(10) + this.internalWeek.isoWeek();
  }

  kw() {
    return this.internalWeek.isoWeek();
  }
}
