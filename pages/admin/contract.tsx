import * as yup from 'yup';
import dayjs from 'dayjs';
import {
  Control, Controller, FieldErrors, useFieldArray,
} from 'react-hook-form';
import React, { useCallback, useState } from 'react';
import { UseFieldArrayRemove } from 'react-hook-form/dist/types/fieldArray';
import { yupResolver } from '@hookform/resolvers/yup';
import { UseFormGetValues } from 'react-hook-form/dist/types/form';
import { AdminPage } from '../../components/AdminPage';
import { LoginResponse } from '../../components/admin/AdminLoginForm';
import { PersonChooser } from '../../components/admin/contract/PersonChooser';
import { useContractFilenames, useCreateContract } from '../../components/admin/contract/contract.api';
import { Form, FormChildrenProps } from '../../components/images-next/form/Form';
import { Input, Textarea } from '../../components/images-next/form/Input';
import { ActionButton, SubmitButton } from '../../components/images-next/button/ActionButton';
import { ContractChooser, CreateContractForm, Person } from '../../components/admin/contract/ContractData';
import { Loadable } from '../../components/images-next/host/Loadable';
import { Markdown } from '../../components/images-next/utils/Markdown';
import { StyledButton } from '../../components/images-next/button/StyledButton';

export default function ContractPage() {
  return (
    <AdminPage title="Vertrag erstellen">
      {(ld) => <DisplayCreateContract loginResponse={ld} />}
    </AdminPage>
  );
}

function DisplayCreateContract({ loginResponse }: { loginResponse: LoginResponse }) {
  const submit = useCreateContract(loginResponse);
  return (
    <>
      <h1 className="mt-4">Neuen Vertrag erstellen</h1>
      <Form
        onSubmit={submit}
        initialValue={{ persons: [{}] }}
        resolver={createContractResolver}
      >
        {(state, control, getValue, setValue, reset) => (
          <CreateContractFormContent
            formState={state}
            setValue={setValue}
            getValue={getValue}
            control={control}
            reset={reset}
            loginResponse={loginResponse}
          />
        )}
      </Form>
    </>
  );
}

function CreateContractFormContent({
  loginResponse,
  formState,
  reset,
  ...rest
}: FormChildrenProps<CreateContractForm> & { loginResponse: LoginResponse }) {
  const { isSubmitSuccessful } = formState;

  return (
    <>
      {!isSubmitSuccessful && <ContractFormFields loginResponse={loginResponse} formState={formState} {...rest} />}
      {isSubmitSuccessful && <ActionButton onClick={reset}>Neuen Vertrag erstellen</ActionButton>}
    </>
  );
}

function ContractFormFields({
  loginResponse,
  control,
  getValue,
  setValue,
  formState,
}: { loginResponse: LoginResponse } & Omit<FormChildrenProps<CreateContractForm>, 'reset'>) {
  const {
    errors,
    isValid,
    isDirty,
    isSubmitting,
  } = formState;

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'persons',
  });

  const [arrayLength, setArrayLength] = useState(1);

  const addPerson: (p: Person) => void = useCallback((p) => {
    append(p);
    setArrayLength((e) => e + 1);
  }, [append]);

  const contractFileNames = useContractFilenames(loginResponse);

  const [markdown, setMarkdown] = useState<string | null>(null);
  const setText: React.FormEventHandler<HTMLTextAreaElement> = useCallback((e) => setMarkdown(e.currentTarget.value), []);

  const setMarkdownAndForm: (string:string)=> void = useCallback((string) => {
    setValue('text', string, { shouldTouch: true, shouldValidate: true, shouldDirty: true });
    setMarkdown(string);
  }, [setValue]);
  return (
    <div className="flex flex-col justify-center">
      <div className="m-4 mx-auto flex w-full justify-around md:w-1/3">
        <StyledButton
          onClick={() => {
            append({});
            setArrayLength((e) => e + 1);
          }}
          className="w-14 rounded-xl bg-green-500 p-4 text-center"
        >
          +
        </StyledButton>
        <StyledButton
          onClick={() => {
            setArrayLength((e) => {
              const lastIndex = e - 1;
              remove(lastIndex);
              return lastIndex;
            });
          }}
          disabled={arrayLength <= 1}
          className="w-14 rounded-xl bg-red-500 p-4 text-center"
        >
          -
        </StyledButton>
      </div>
      {fields.map((field, idx) => <PersonForm control={control} key={field.id} idx={idx} errors={errors.persons} remove={remove} />)}
      <PersonChooser addPerson={addPerson} loginResponse={loginResponse} />
      <Loadable {...contractFileNames}>
        {(f) => (
          <Controller
            name="contractType"
            control={control}
            render={
              ({
                field: {
                  value,
                  onChange,
                },
              }) => <ContractChooser value={value} onChange={onChange} data={f} />
            }
          />
        )}
      </Loadable>

      <Textarea required onChange={setText} label="Zusätzlicher Vertragstext" name="text" control={control} />
      <Pricing get={getValue} set={setMarkdownAndForm} />
      {markdown !== null && (
        <>
          <h2 className="my-4">Preview</h2>

          <Markdown className="rounded-lg border border-primary p-2" content={markdown} />
        </>
      )}
      <Input required label="Vertrag kann bis zum folgenden Zeitpunkt unterschrieben werden" name="dueDate" control={control} type="datetime-local" />
      <SubmitButton
        isSubmitting={isSubmitting}
        errors={errors}
        disabled={!isValid || !isDirty || isSubmitting}
        className="mt-4 bg-primary text-onPrimary md:col-span-2"
      >
        Vertrag erstellen
      </SubmitButton>
    </div>
  );
}

function Pricing({
  get,
  set,
}: { get: UseFormGetValues<CreateContractForm>, set: (string:string) => void }) {
  const [eur, setEur] = useState(100);

  const text = `## Kosten\nAls Entgelt wird Honorar von ${eur.toLocaleString('de')}€ vereinbart.`;
  const onClick = () => {
    const old = get('text') ?? '';
    set(`${old + (old.length > 0 ? '\n' : '')}${text}`);
  };
  return (
    <div className="my-2 flex">
      <input type="number" step="20" value={eur} onChange={(e) => setEur(parseInt(e.currentTarget.value, 10))} />
      <StyledButton onClick={onClick}>Einfügen</StyledButton>
    </div>
  );
}

function PersonForm({
  idx,
  control,
  errors,
  remove,
}: { idx: number, control: Control<CreateContractForm>, errors: FieldErrors<CreateContractForm>['persons'], remove: UseFieldArrayRemove }) {
  const curErrors = errors === undefined ? undefined : errors[idx];
  return (
    <div className="my-4">
      <h2>
        {idx + 1}
        {'. '}
        Person

        <span className="ml-4 cursor-pointer rounded-full border p-2" onClick={() => remove(idx)}>X</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Input label="Vorname" control={control} errorMessage={curErrors?.firstName} required className="md:mr-1" name={`persons.${idx}.firstName`} />
        <Input label="Nachname" control={control} errorMessage={curErrors?.lastName} required className="md:ml-1" name={`persons.${idx}.lastName`} />
        <Input label="E-Mail" control={control} errorMessage={curErrors?.email} required name={`persons.${idx}.email`} className="md:mr-1" type="email" />
        <Input label="Geburtstag" name={`persons.${idx}.birthday`} errorMessage={curErrors?.birthday} control={control} type="date" className="md:ml-1" />
      </div>
    </div>
  );
}

const createContractResolver = yupResolver(yup.object(
  {
    persons: yup.array()
      .required()
      .min(2)
      .of(
        yup.object({
          firstName: yup.string()
            .required(),
          lastName: yup.string()
            .required(),
          email: yup.string()
            .email(),
          birthday: yup.date()
            .required()
            .transform((e) => dayjs(e)
              .toDate())
            .max(dayjs()
              .add(-1, 'year')
              .toDate(), 'Geburtstag ')

          ,
        }),
      ),
    text: yup.string()
      .required('Zusätzlicher Text ist verpflichtend'),
    dueDate: yup.date()
      .required()
      .transform((e) => dayjs(e)
        .toDate())
      .min(dayjs()
        .toDate(), 'Vertragsunterschriftsdatum muss in der Zukunft sein'),

  },
)
  .required());
