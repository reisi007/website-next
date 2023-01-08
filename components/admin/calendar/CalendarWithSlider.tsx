import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { ShootingDateEntry } from './calendar.api';
import { Calendar } from './Calendar';

export function CalendarWithSlider({ data }: { data: Array<ShootingDateEntry> }) {
  const [weekSliderValueInternal, setWeekSliderValue] = useState(8);
  const [weekSliderValue] = useDebounce(weekSliderValueInternal, 300, { maxWait: 500 });

  return (
    <Calendar weeks={weekSliderValue} data={data}>
      <div className="flex items-center justify-center text-center">
        <input
          name="weekSlider"
          value={weekSliderValueInternal}
          onChange={(e) => setWeekSliderValue(parseInt(e.target.value, 10))}
          max={20}
          min={4}
          className="mr-2 accent-primary-accent"
          type="range"
        />
        <label htmlFor="weekSlider">{`${weekSliderValueInternal} Wochen`}</label>
      </div>
    </Calendar>
  );
}
