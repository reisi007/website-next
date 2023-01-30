export function Guthaben({ eur }:{ eur:number }) {
  return (
    <span className="my-2 mx-auto rounded-2xl bg-green-600 p-4 text-3xl text-white">
      <span>
        Guthaben:&nbsp;
      </span>
      <span>
        {eur}
        {' '}
        €
      </span>
    </span>
  );
}
