import React from 'react';
import Link from 'next/link';
import { Bonus } from './Bonus';
import {
  BonusPersonWithTotal, BonusProgramDetailsEntry, BonusProgramDetailsResponse, useGetBonusProgramMemberDetails,
} from '../api/bonus.api';
import { Loadable } from '../images-next/host/Loadable';
import { Card } from '../images-next/utils/Card';
import { FormattedDate } from '../images-next/utils/Age';
import { Badge } from '../images-next/utils/Badge';

export function BonusProgramHeader({ entry }: { entry: BonusPersonWithTotal }) {
  const {
    firstName,
    lastName,
    total,
  } = entry;

  return (
    <div className="flex flex-col justify-center">
      <h2 className="mt-2 text-2xl">
        Bonusprogramm für
        {' '}
        {firstName}
        {' '}
        {lastName}
      </h2>
      <Bonus eur={Number(total)} />
      <Link className="text-center" href="/bonus">Zu den Bedingungen</Link>
    </div>
  );
}

export function BonusProgramDetails({
  id,
  pin,
}: { id: string, pin: string }) {
  const response = useGetBonusProgramMemberDetails(id, pin);
  return (

    <Loadable {...response}>
      {(data) => <BonusProgramDetailsContent {...data} />}
    </Loadable>

  );
}

export function BonusProgramDetailsContent({
  used,
  unused,
}: BonusProgramDetailsResponse) {
  return (
    <>
      {(unused.length > 0 || used.length > 0) && (<h3>Details</h3>) }
      {unused.length > 0 && (
        <>
          <h3>Unbenutzt</h3>
          <DisplayDetailEntries entries={unused} />
        </>
      )}
      {used.length > 0 && (
        <>
          <h3>Benutzt</h3>
          <DisplayDetailEntries entries={used} />
        </>
      )}

    </>
  );
}

export function DisplayDetailEntries({ entries }: { entries: Array<BonusProgramDetailsEntry> }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {entries.map((e) => (
        <Card className="text-center" key={e.rawId}>
          <h4>{e.text}</h4>
          <p className="font-bold">
            {e.value}
            €
          </p>
          <Badge>
            Gültig bis:
            {' '}
            <span className="font-semibold">
              <FormattedDate dateString={e.expireAt} />
            </span>
          </Badge>
        </Card>
      ))}
    </div>
  );
}
