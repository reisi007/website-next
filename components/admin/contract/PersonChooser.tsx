import {
  useCallback, useEffect,
} from 'react';
import {
  GroupBase, OptionProps, SingleValueProps,
} from 'react-select';
import classNames from 'classnames';
import { SearchablePerson, useKnownPersons } from './contract.api';
import { Loadable } from '../../images-next/host/Loadable';
import { CalculatedBirthday, FormattedDate } from '../../images-next/utils/Age';
import { ActionButton } from '../../images-next/button/ActionButton';
import { MoreProps, useSelect } from '../../utils/react-select';
import { Person } from './ContractData';

export function PersonChooser({ jwt, addPerson }:{ jwt: string, addPerson: (person: Person) => void }) {
  const swr = useKnownPersons(jwt);
  return (
    <>
      <h2>Stammkunden suchen</h2>
      <Loadable {...swr}>
        {(date) => <DisplayPersonChooser addPerson={addPerson} persons={date} />}
      </Loadable>
    </>
  );
}

function DisplayPerson({
  firstName,
  lastName,
  email,
  birthday,
}: Person) {
  return (
    <>
      <b>
        {firstName}
        {' '}
        {lastName}
      </b>
      {' '}
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

function PersonOption(row: OptionProps<SearchablePerson, false, GroupBase<SearchablePerson>>) {
  const onClick = useCallback(() => row.selectOption(row.data), [row]);
  return (
    <div onClick={onClick} className="m-4">
      <DisplayPerson {...row.data} />
    </div>
  );
}

function PersonSingleValue(row: SingleValueProps<SearchablePerson, false, GroupBase<SearchablePerson>>) {
  return (
    <div>
      {' '}
      <DisplayPerson {...row.data} />
    </div>
  );
}

function DisplayPersonChooser({ persons, addPerson }: { persons: SearchablePerson[], addPerson: (person: Person) => void }) {
  const moreProps: MoreProps<SearchablePerson, false> = {
    placeholder: 'Stammkunde suchen...',
    className: classNames('grow sm:mr-4'),
    noOptionsMessage: (e) => `Nicht verfügbar mit ${e}`,
    components: {
      Option: PersonOption,
      SingleValue: PersonSingleValue,
    },
  };

  const { select, setOptions, curSelected } = useSelect<SearchablePerson, false>(false, null, moreProps);

  useEffect(() => {
    setOptions(persons.sort((a, b) => a.search.localeCompare(b.search)));
  }, [persons, setOptions]);

  const onClick = useCallback(() => {
    if (curSelected === null) return;
    addPerson(curSelected);
  }, [addPerson, curSelected]);

  return (
    <div className="my-2 grid grid-cols-1  space-y-2 sm:flex sm:items-stretch sm:space-y-0">
      {select}
      <ActionButton onClick={onClick} disabled={curSelected === null}>Person hinzufügen</ActionButton>
    </div>
  );
}
