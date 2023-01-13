import { FieldPathValue } from 'react-hook-form';
import classNames from 'classnames';
import React, { useEffect, useId, useMemo } from 'react';
import { useSelect } from '../../utils/react-select';

export type Person = {
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
};

export type CreateContractForm = {
  persons: Array<Partial<Person>>,
  contractType: string,
  text?: string,
  dueDate: string,
  server?: string
};

type ContractData = { label: string, value: string, search: string };

function convert(e:string): ContractData {
  return {
    label: capitalizeFirstLetter(e.substring(0, e.indexOf('.'))),
    value: e,
    search: e,
  };
}

export function ContractChooser({ data, value, onChange }: { data: Array<string>, value: FieldPathValue<CreateContractForm, 'contractType'>, onChange: (...event: any[]) => void }) {
  const id = useId();
  const {
    select,
    setOptions,
    setCurSelected,
    curSelected,
  } = useSelect(false, null, {
    className: classNames('my-2'),
    placeholder: 'Vertrag auswählen....',
    id,
  });

  const options = useMemo(() => data.map(convert), [data]);

  useEffect(() => {
    setOptions(options);
  }, [options, setOptions]);

  useEffect(() => {
    onChange(curSelected?.search);
  }, [curSelected, onChange]);

  useEffect(() => {
    setCurSelected(value === undefined ? null : convert(value));
  }, [setCurSelected, value]);

  return (
    <label htmlFor={id}>
      Vertrag auswählen
      {select}
    </label>
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0)
    .toUpperCase() + string.slice(1);
}
