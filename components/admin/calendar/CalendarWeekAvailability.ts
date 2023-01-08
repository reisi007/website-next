import * as dayjs from 'dayjs';
import { CalendarWeek } from './CalendarWeek';
import { ShootingDateEntry, ShootingSlotState } from './calendar.api';

export class CalendarWeekAvailability {
  readonly calendarWeek: CalendarWeek;

  private internalState: ShootingSlotState = ShootingSlotState.FREE;

  private internalText?: string;

  private openWeeks: number;

  constructor(calendarWeek: CalendarWeek, openWeeks: number, state: ShootingSlotState, text?: string);
  constructor(date: dayjs.Dayjs, openWeeks: number);
  constructor(first: CalendarWeek | dayjs.Dayjs, openWeeks: number, state?: ShootingSlotState, text?: string) {
    if (!first) {
      throw Error('First param must be a dayjs.Date or a CalendarWeek');
    }

    if (first instanceof CalendarWeek) {
      this.calendarWeek = first;

      if (state) {
        this.internalState = state;
      }
      this.internalText = text;
    } else {
      this.calendarWeek = new CalendarWeek(first);
    }
    this.openWeeks = openWeeks;
  }

  get text(): string | undefined {
    return this.internalText;
  }

  get state() {
    return this.internalState;
  }

  private static isFinalRun(computedAvailabilities: Array<CalendarWeekAvailability>, idx: number) {
    return idx >= computedAvailabilities.length;
  }

  process(event: Array<CalendarWeekAvailability>, index: number): void;
  process(event: ShootingDateEntry): void;
  process(event: Array<CalendarWeekAvailability> | ShootingDateEntry, index: number | undefined = undefined): void {
    if (Array.isArray(event)) {
      if (index === undefined) {
        throw Error('Index must be defined');
      }
      this.finalize(event, index);
    } else {
      this.processInternal(event);
    }
  }

  isFree(): boolean {
    return this.internalState === ShootingSlotState.FREE;
  }

  isBusy(): boolean {
    return this.internalState === ShootingSlotState.BUSY;
  }

  isTaken(): boolean {
    return this.internalState === ShootingSlotState.TAKEN;
  }

  isBlocked(): boolean {
    return this.internalState === ShootingSlotState.BLOCKED;
  }

  hasNotYetOpened(): boolean {
    return this.internalState === ShootingSlotState.NOT_YET_OPENED;
  }

  withText(text: string | undefined = this.internalText): CalendarWeekAvailability {
    return new CalendarWeekAvailability(this.calendarWeek, this.openWeeks, this.internalState, text);
  }

  private processInternal(event: ShootingDateEntry) {
    if (event.kw !== this.calendarWeek.kw()) {
      return;
    }

    this.internalText = event.text;
    this.internalState = event.state;
  }

  private finalize(event: Array<CalendarWeekAvailability>, idx: number) {
    this.markFreeWeeksBetweenShootingsAsBusy(event, idx);
    this.markFreeWeeksAsNotAvailable(event, idx, this.openWeeks);
  }

  private markFreeWeeksBetweenShootingsAsBusy(computedAvailabilities: Array<CalendarWeekAvailability>, idx: number) {
    if (CalendarWeekAvailability.isFinalRun(computedAvailabilities, idx) || !(this.isFree() || this.isBusy())) {
      return;
    }

    const weeksToMark = [
      this.calendarWeek.next(),
      this.calendarWeek.prev(),
    ];

    const prevAndNextWeek = computedAvailabilities.filter((e) => weeksToMark.some((w) => e.calendarWeek.equals(w)));
    const markAsBlocked = prevAndNextWeek.every((e) => e.internalState === ShootingSlotState.TAKEN);

    if (markAsBlocked) {
      this.internalState = ShootingSlotState.BLOCKED;
      return;
    }

    const markAsBusy = prevAndNextWeek.some((e) => e.internalState === ShootingSlotState.TAKEN);
    if (markAsBusy) {
      this.internalState = ShootingSlotState.BUSY;
    }
  }

  private markFreeWeeksAsNotAvailable(event: Array<CalendarWeekAvailability>, idx: number, firstIndex: number) {
    if (event[0] !== this || !CalendarWeekAvailability.isFinalRun(event, idx)) {
      return;
    }
    for (let i = firstIndex; i < event.length; i += 1) {
      const availability = event[i];
      if (availability.isFree() || availability.isBusy()) {
        availability.internalState = ShootingSlotState.NOT_YET_OPENED;
      }
    }
  }
}
