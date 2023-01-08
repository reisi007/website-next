import React, { HTMLProps, useMemo } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { CalendarWeekAvailability } from './CalendarWeekAvailability';
import { ShootingDateEntry, ShootingSlotState } from './calendar.api';

type RowCreator = (e: CalendarWeekAvailability, idx: number) => React.ReactElement<HTMLProps<HTMLDataListElement>>;
export type Props = {
  data: Array<ShootingDateEntry>,
  weeks: number,
  rowCreator?: RowCreator,
  children?: React.ReactElement,
  className?: string
};

const defaultRowCreator = (e: CalendarWeekAvailability) => (
  <CalendarRow key={(e.text ?? '') + e.calendarWeek.kw()} data={e} />
);

export function Calendar({
  data,
  weeks,
  children,
  rowCreator = defaultRowCreator,
  className,
}: Props) {
  const rows = useMemo(() => prepareDate(data, weeks)
    .map(rowCreator), [data, rowCreator, weeks]);
  return (
    <div className={className}>
      <h2 className="mb-2">
        Kalendar
      </h2>
      {children}
      <ul className="mx-auto flex w-full flex-col justify-center md:w-1/2">{rows}</ul>
    </div>
  );
}

const prepareDate = (values: Array<ShootingDateEntry>, displayedWeeks: number): Array<CalendarWeekAvailability> => {
  const calculationOffset = 1;
  const openWeeks = 6;
  const startWeek = dayjs()
    .add(-calculationOffset, 'weeks');
  const weeks = displayedWeeks + 2 * calculationOffset;

  // Set all green
  const computedValues = new Array<CalendarWeekAvailability>();
  for (let i = 0; i < weeks; i += 1) {
    computedValues.push(
      new CalendarWeekAvailability(startWeek.add(i, 'weeks'), calculationOffset + openWeeks),
    );
  }

  values.forEach((event) => {
    computedValues.forEach((consumer) => {
      consumer.process(event);
    });
  });

  computedValues.forEach((consumer, idx) => consumer.process(computedValues, idx));
  computedValues.forEach((consumer) => consumer.process(computedValues, computedValues.length));

  return computedValues.slice(calculationOffset, -calculationOffset);
};

function CalendarRow({ data }: { data: CalendarWeekAvailability }) {
  const {
    state,
    calendarWeek,
    text: rawText = '',
  } = data;
  return (
    <>
      {rawText.split('&&')
        .map((_text) => {
          const idx = _text.indexOf('|');
          let text = (idx > 0 ? _text.substring(0, idx) : _text).trim();
          if (text.length > 0) {
            text = `(${text})`;
          }
          const final = `KW ${calendarWeek.kw()
            .toString(10)
            .padStart(2, '0')} - Woche ab ${calendarWeek.format()} ${text}`;

          return (
            <li
              key={calendarWeek.kw()
                .toString(10) + text}
              className={classNames(
                'text-center flex items-center justify-center p-2',
                {
                  'text-white bg-gray-500': state === ShootingSlotState.BLOCKED,
                  'text-black bg-yellow-300': state === ShootingSlotState.BUSY,
                  'text-white bg-green-600': state === ShootingSlotState.FREE,
                  'text-white bg-red-500': state === ShootingSlotState.TAKEN,
                  'text-gray-700 bg-gray-300': state === ShootingSlotState.NOT_YET_OPENED,
                },
              )}
            >
              <Emoji
                text={_text}
              />
              <span className="grow">
                {final}
              </span>
            </li>
          );
        })}
    </>
  );
}

const RAW_EMOJI_DATA: { [key: string]: string | Array<string> } = {
  '🌇': 'Sonnenuntergang',
  '🛋️': 'Indoor',
  '🏞️': 'Outdoor',
  '👙': 'Boudoir',
  '👧': ['Portrait', 'Porträt'],
  '👩‍❤️‍👨': ['Paar', 'Pärchen'],
  '🐶': 'Hund',
  '🏘': 'Stadt',
  '💃': 'Tanz',
  '🤸‍♀️': ['Sport', 'Fitness'],
  '👥': ['Gruppe'],
  '🧘‍♀️': 'Yoga',
  '🎥': 'Video',
  '❓❓': '??',
};

const EMOJI_CONFIG: Array<[string, Array<string>]> = Object.entries(RAW_EMOJI_DATA)
  .map((data) => {
    const [key, value] = data;
    if (typeof value === 'string') {
      return [key, [value.toLowerCase()]];
    }

    return [key, value.map((e) => e.toLowerCase())];
  });

export function Emoji({ text: _text }: { text: string }) {
  const text = _text.toLowerCase();
  let emojis = '';
  EMOJI_CONFIG.forEach(([key, value]) => {
    const includes = value.some((v) => text.includes(v));
    if (includes) {
      emojis += key;
    }
  });

  return (
    <>
      {!!emojis && (
        <span
          className="w-14 items-center justify-self-start rounded-lg bg-white p-1 text-center"
        >
          {emojis}
        </span>
      )}
    </>
  );
}
