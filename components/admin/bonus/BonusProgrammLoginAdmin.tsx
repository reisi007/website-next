import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useId } from 'react';
import classNames from 'classnames';
import { GroupBase, OptionProps, SingleValueProps } from 'react-select';
import { useGetBonusProgramMembers } from './bonus.api';
import { Loadable } from '../../images-next/host/Loadable';
import { useSelect } from '../../utils/react-select';
import { ActionButton } from '../../images-next/button/ActionButton';
import { CalculatedBirthday, FormattedDate } from '../../images-next/utils/Age';
import { BonusPersonWithTotal } from '../../api/bonus.api';

export function BonusProgrammLoginAdmin({ jwt }: { jwt: string }) {
  const members = useGetBonusProgramMembers(jwt);
  return (
    <Loadable {...members}>
      {(date) => <DropDown data={date} />}
    </Loadable>
  );
}

function BonusOption(row: OptionProps<BonusPersonWithTotal & { search: string }, false, GroupBase<BonusPersonWithTotal & { search: string }>>) {
  const onClick = useCallback(() => row.selectOption(row.data), [row]);
  return (
    <div onClick={onClick} className="m-4">
      <DisplayBonusPerson {...row.data} />
    </div>
  );
}

function BonusSingleValue(row: SingleValueProps<BonusPersonWithTotal & { search: string }, false, GroupBase<BonusPersonWithTotal & { search: string }>>) {
  return (
    <div>
      <DisplayBonusPerson {...row.data} />
    </div>
  );
}

function DisplayBonusPerson({
  firstName,
  lastName,
  email,
  birthday,
  total,
  id,
}: BonusPersonWithTotal & { search: string }) {
  return (
    <>
      {id}
      {' '}
      <b>
        {firstName}
        {' '}
        {lastName}
      </b>
      {' '}
      {total}
      {'€ '}
      {email}
      {' '}
      <FormattedDate dateString={birthday} />
      {' '}
      <b>
        <CalculatedBirthday dateString={birthday} />
      </b>
    </>
  );
}

function DropDown({ data }: { data: Array<BonusPersonWithTotal> }) {
  const { push } = useRouter();
  const selectId = useId();
  const {
    select,
    setOptions,
    curSelected,
  } = useSelect<BonusPersonWithTotal & { search: string }, false>(false, null, {
    id: selectId,
    placeholder: 'Bonusprogramm durchsuchen...',
    className: classNames('grow sm:mr-4 my-2'),
    noOptionsMessage: (e) => `Nicht verfügbar mit ${e}`,
    components: {
      Option: BonusOption,
      SingleValue: BonusSingleValue,
    },
  });

  useEffect(() => {
    setOptions(
      data.map((e) => ({
        ...e,
        search: `${e.firstName} ${e.lastName} ${e.email} ${e.id} ${e.birthday} ${e.pin}`,
      })),
    );
  }, [data, setOptions]);

  const submit = useCallback(() => {
    if (curSelected === null) return;
    const {
      id,
      pin,
    } = curSelected;
    push({
      pathname: '/admin/bonus/edit',
      query: {
        id,
        pin,
      },
    });
  }, [curSelected, push]);

  return (
    <div className="p">
      <h2 className="mt-2">Bonusprogramm durchsuchen</h2>
      <div className="flex space-x-2">
        {select}
        <ActionButton className="bg-primary text-onPrimary" disabled={curSelected === null} onClick={submit}>Öffnen</ActionButton>
      </div>
    </div>
  );
}
