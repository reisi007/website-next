import dayjs, { Dayjs } from 'dayjs';

export const TEMPLATE_STRING_AS_DATE = 'YYYY-MM-DD';
export const TEMPLATE_DATE = 'DD.MM.YYYY';
export const TEMPLATE_DATETIME = `${TEMPLATE_DATE} HH:mm`;

type DateFormattingProps = { dateString: string };
type RelativeToDateFormattingProps = DateFormattingProps & { relativeTo?: string };

export function formatDateTime(dateString: string) {
  return dayjs(dateString)
    .format(TEMPLATE_DATETIME);
}

export function FormattedDateTime({ dateString }: DateFormattingProps) {
  return (
    <>
      {formatDateTime(dateString)}
    </>
  );
}

export function DaysAgo({
  dateString,
  relativeTo,
}: RelativeToDateFormattingProps) {
  const dayJsRelativeTo = dayjs(relativeTo);
  const daysAgo = computeDaysAgo(dateString, dayJsRelativeTo);
  if (daysAgo === 1) return <>Gestern</>;
  return (
    <>
      {`Vor ${daysAgo} Tagen`}
    </>
  );
}

export function computeDaysAgo(dateString: string, relativeTo: Dayjs = dayjs()) {
  return -dayjs(dateString)
    .diff(relativeTo, 'days', false);
}

export function formatDate(dateString: string) {
  return dayjs(dateString)
    .format(TEMPLATE_DATE);
}

export function FormattedDate({ dateString }: DateFormattingProps) {
  return <>{formatDate(dateString)}</>;
}

export function calculateAge({
  dateString: birthday,
  relativeTo,
}: RelativeToDateFormattingProps) {
  const age = dayjs(relativeTo)
    .diff(dayjs(birthday), 'year', true);
  return `${(Math.floor(age * 100) / 100).toFixed(2)} Jahre`;
}

export function CalculatedBirthday(props: RelativeToDateFormattingProps) {
  return (
    <>
      {calculateAge(props)}
    </>
  );
}
