import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { KeyedMutator } from 'swr/_internal';
import { ErrorOption } from 'react-hook-form';
import Link from 'next/link';
import { SWRResponse } from 'swr';
import { AdminPage } from '../../../components/AdminPage';
import { Content404 } from '../../../components/images-next/404';
import { DisplayError, Loadable } from '../../../components/images-next/host/Loadable';
import { ensureString } from '../../../components/images-next/form/Url2Form';
import {
  BonusPersonWithTotal, BonusProgramDetailsEntry, BonusProgramDetailsResponse, useGetBonusProgramMember, useGetBonusProgramMemberDetails,
} from '../../../components/api/bonus.api';
import { BonusProgramHeader, DisplayDetailEntries } from '../../../components/bonus/BonusProgramHeader';
import { ActionButton, SubmitButton } from '../../../components/images-next/button/ActionButton';
import { PutBonusEntry, useCreateBonusApiEntry, useDeleteBonusApiEntry } from '../../../components/admin/bonus/bonus.api';
import { Form, MinimalFormChildrenProps } from '../../../components/images-next/form/Form';
import { Input } from '../../../components/images-next/form/Input';
import { Card } from '../../../components/images-next/utils/Card';
import { Badge } from '../../../components/images-next/utils/Badge';
import { FormattedDate } from '../../../components/images-next/utils/Age';

export default function AdminEditBonusProgram() {
  const {
    id,
    pin,
  } = useRouter().query;
  const idString = ensureString(id);
  const pinString = ensureString(pin);
  const isLoggedIn = idString !== undefined && pinString !== undefined;

  if (!isLoggedIn) {
    return (
      <AdminPage title="Bonusprogramm nicht gefunden">
        {(_) => <Content404 />}
      </AdminPage>
    );
  }

  return (
    <AdminPage title="Bonusprogramm bearbeiten">
      {(jwt) => <AdminEditBonusProgramContent id={idString} pin={pinString} jwt={jwt} />}
    </AdminPage>
  );
}

function AdminEditBonusProgramContent({
  id,
  pin,
  jwt,
}: { jwt: string, id: string, pin: string }) {
  const member = useGetBonusProgramMember(id, pin);
  const { mutate: mutateMember } = member;
  const details = useGetBonusProgramMemberDetails(id, pin);
  const { mutate: mutateDetails } = details;
  return (
    <Loadable {...member}>
      {(date) => (
        <div className="p">
          <BonusProgramHeader entry={date} />
          <Link className="mt-2 block text-center" href={`/bonus?id=${id}&pin=${pin}`}>Öffentliche Ansicht</Link>
          <AddNewEntry id={Number(id)} jwt={jwt} mutateMember={mutateMember} mutateDetails={mutateDetails} />
          <AdminBonusProgramDetails {...details} jwt={jwt} totalMutate={mutateMember} />
        </div>
      )}
    </Loadable>
  );
}

const PREDEFINED_BONUS_ENTRY: Array<Omit<PutBonusEntry, 'id'>> = [
  {
    text: 'Bonus Shooting',
    value: 20,
    expireAt: dayjs()
      .add(18, 'months')
      .format('YYYY-MM-DD'),
  }, {
    text: 'Weiterempfehlung',
    value: 10,
    expireAt: dayjs()
      .add(9, 'months')
      .format('YYYY-MM-DD'),
  }, {
    text: 'Geburtstagsgeschenk',
    value: 100,
    expireAt: dayjs()
      .add(1, 'year')
      .add(-1, 'day')
      .format('YYYY-MM-DD'),
  },
];

function AddNewEntry({
  id,
  jwt,
  mutateMember,
  mutateDetails,
}: { jwt: string, id: number, mutateMember: KeyedMutator<BonusPersonWithTotal>, mutateDetails: KeyedMutator<BonusProgramDetailsResponse> }) {
  const [prefilled, setPrefilled] = useState<PutBonusEntry | undefined>(undefined);
  const reset = useCallback(() => {
    setPrefilled(undefined);
  }, []);
  const submit = useCreateBonusApiEntry(jwt, id, mutateMember, mutateDetails);
  return (
    <>
      <div className="my-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {
          PREDEFINED_BONUS_ENTRY.map((e) => (
            <ActionButton
              key={e.text}
              onClick={() => {
                setPrefilled({
                  ...e,
                  id,
                });
              }}
            >
              {e.text}
            </ActionButton>
          ))
        }
      </div>

      <Form<PutBonusEntry> onSubmit={submit} resolver={reviewResolver} prefilled={prefilled}>
        {(state, control) => <AddNewEntryContent prefilled={prefilled} formState={state} control={control} reset={reset} />}
      </Form>
    </>
  );
}

function AddNewEntryContent({
  formState,
  control,
  reset,
}: MinimalFormChildrenProps<PutBonusEntry> & { reset: () => void }) {
  const {
    errors,
    isValid,
    isDirty,
    isSubmitting,
    isSubmitSuccessful,
  } = formState;

  return (
    <>
      {!isSubmitSuccessful && (
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Input name="text" label="Text" control={control} errorMessage={errors.text} required className="md:col-span-2" />
          <Input<PutBonusEntry, any> label="Wert" type="number" step="0.01" control={control} errorMessage={errors.value} required className="md:mr-1" name="value" />
          <Input label="Gültig bis" type="date" control={control} errorMessage={errors.expireAt} required className="md:ml-1" name="expireAt" />
          <SubmitButton isSubmitting={isSubmitting} errors={errors} disabled={!isValid || !isDirty || isSubmitting} className="mt-4 bg-primary text-onPrimary md:col-span-2">Absenden</SubmitButton>
        </div>
      )}
      {isSubmitSuccessful && (
        <div className="my-2 flex flex-col space-y-2">
          <h2>Bonus erfolgreich gespeichert</h2>
          <ActionButton type="reset" onClick={reset}>Weiteres Element eingeben</ActionButton>
        </div>
      )}
    </>
  );
}

const reviewResolver = yupResolver(yup.object(
  {
    id: yup.number()
      .required('Keine ID angegeben'),
    expireAt: yup.date()
      .required()
      .transform((e) => dayjs(e)
        .toDate())
      .min(dayjs()
        .add(1, 'day')
        .toDate(), 'Expiry date must be in the future'),
    text: yup.string()
      .required('Text ist ein Pflichtfeld'),
    value: yup.number()
      .min(1, ''),
  },
)
  .required());

type AdminBonusProgramDetailsProps = SWRResponse<BonusProgramDetailsResponse> & {
  jwt: string,
  totalMutate: KeyedMutator<BonusPersonWithTotal>
};

export function AdminBonusProgramDetails({
  jwt,
  ...details
}: AdminBonusProgramDetailsProps) {
  const { mutate } = details;
  return (
    <Loadable {...details}>
      {(data) => <AdminBonusProgramDetailsContent {...details} {...data} jwt={jwt} detailsMutate={mutate} />}
    </Loadable>
  );
}

export function AdminBonusProgramDetailsContent({
  used,
  unused,
  ...rest
}: BonusProgramDetailsResponse & {
  jwt: string,
  totalMutate: KeyedMutator<BonusPersonWithTotal>
  detailsMutate: KeyedMutator<BonusProgramDetailsResponse>
}) {
  return (
    <div className="mt-4">
      {unused.length > 0 && (
        <>
          <h3>Unbenutzt</h3>
          <AdminDisplayDetailEntries {...rest} entries={unused} />
        </>
      )}
      {used.length > 0 && (
        <>
          <h3>Benutzt</h3>
          <DisplayDetailEntries entries={used} />
        </>
      )}

    </div>
  );
}

type AdminDisplayDetailEntriesProps = {
  entries: Array<BonusProgramDetailsEntry>,
  jwt: string,
  totalMutate: KeyedMutator<BonusPersonWithTotal>,
  detailsMutate: KeyedMutator<BonusProgramDetailsResponse>
};

export function AdminDisplayDetailEntries({
  jwt,
  entries,
  totalMutate,
  detailsMutate,
}: AdminDisplayDetailEntriesProps) {
  const mutate = useCallback((removed: BonusProgramDetailsEntry) => {
    totalMutate((e) => {
      if (e === undefined) return undefined;
      return {
        ...e,
        total: e.total - removed.value,
      };
    });

    detailsMutate((e) => {
      if (e === undefined) return undefined;
      return {
        used: e.used.splice(0, 0, removed),
        unused: e.unused.splice(e.unused.indexOf(removed), 1),
      };
    });
  }, [detailsMutate, totalMutate]);
  const rawOnClick = useDeleteBonusApiEntry(jwt, mutate);
  const [error, setError] = useState<ErrorOption | null>(null);

  const usedOnClick = useCallback((be: BonusProgramDetailsEntry) => rawOnClick(
    (e, v) => {
      if (e === 'server') setError(v);
    },
    (e) => {
      if (e === 'server') setError(null);
    },
    be,
  ), [rawOnClick]);

  return (
    <>
      {error !== null && error.message !== undefined && <DisplayError className="my-4" error={{ message: error.message }} />}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {entries.map((e) => (
          <AdminDisplayDetailEntry key={e.rawId} e={e} rawOnClick={usedOnClick} />
        ))}
      </div>
    </>
  );
}

type Props = {
  e: BonusProgramDetailsEntry,
  rawOnClick: (e: BonusProgramDetailsEntry) => void
};

export function AdminDisplayDetailEntry({
  e,
  rawOnClick,
}: Props) {
  return (
    <Card onClick={() => rawOnClick(e)} className="text-center">
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
  );
}
