import { KeyedMutator } from 'swr/_internal';
import {
  ReactNode, useCallback, useEffect, useMemo,
} from 'react';
import { Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form/dist/types/form';
import {
  LogEntry, LogType, SignStatus, useGetLogEntries, usePutLogEntry, useSignStatus,
} from '../api/contract.api';
import { LargeLoadingIndicator, Loadable } from '../images-next/host/Loadable';
import { useModal } from '../images-next/utils/Modal';
import { FormattedDateTime } from '../images-next/utils/Age';
import { ActionButton, SubmitButton } from '../images-next/button/ActionButton';
import { Markdown } from '../images-next/utils/Markdown';
import { ExtSubmitHandler, Form, Shape } from '../images-next/form/Form';
import { CheckboxInput } from '../images-next/form/Input';
import { Card } from '../images-next/utils/Card';
import { Badge } from '../images-next/utils/Badge';

export function SignAction({
  email,
  uuid,
  dsgvo,
}: { email: string, uuid: string, dsgvo: string | null }) {
  const signStatus = useSignStatus(email, uuid);

  return (
    <Loadable {...signStatus}>
      {(response) => <SignActionArea dsgvo={dsgvo} cur={response} refetchSignStatus={signStatus.mutate} email={email} uuid={uuid} />}
    </Loadable>
  );
}

type DsgvoAccept = { dsgvo: boolean, server?: string };
const reviewResolver: Resolver<DsgvoAccept> = yupResolver(yup.object<Partial<Shape<DsgvoAccept>>>({
  dsgvo: yup.boolean()
    .isTrue('Die Zustimmung zu den Datenschutzbedingungen ist nicht optional'),
})
  .required());

function SignActionArea({
  email,
  uuid,
  refetchSignStatus,
  cur,
  dsgvo,
}: { email: string, uuid: string, cur: Array<SignStatus>, dsgvo: string | null, refetchSignStatus: KeyedMutator<Array<SignStatus>> }) {
  const isSigned = useMemo(() => cur.findIndex(({
    signed,
    email: curEmail,
  }) => signed && email === curEmail) >= 0, [cur, email]);

  const {
    mutate: mutateLogEntries,
    data: logEntries,
  } = useGetLogEntries(email, uuid);
  const rawPutLogEntry = usePutLogEntry<DsgvoAccept>(email, uuid, '...', mutateLogEntries);
  const putLogEntry = useCallback((l: LogType) => {
    rawPutLogEntry(l, () => { }, () => {}).then(null, (e) => console.error(e));
  }, [rawPutLogEntry]);
  useEffect(() => {
    if (!isSigned) {
      putLogEntry('OPEN');
    }
  }, [isSigned, email, uuid, putLogEntry]);

  const signAction: ExtSubmitHandler<DsgvoAccept> = useCallback((_, setErrors, clearErrors) => {
    rawPutLogEntry('SIGN', setErrors, clearErrors)
      .then(() => {
        refetchSignStatus();
      });
  }, [rawPutLogEntry, refetchSignStatus]);

  return (
    <div className="grid gap-2">
      <DsgvoAcceptForm isSigned={isSigned} onSubmit={signAction} dsgvo={dsgvo}>
        <LogDetails logEntries={logEntries} mutateLogEntries={mutateLogEntries} />
      </DsgvoAcceptForm>
    </div>
  );
}

function LogDetails({ logEntries, mutateLogEntries }:{ logEntries?: Array<LogEntry>, mutateLogEntries:KeyedMutator<Array<LogEntry>> }) {
  const content = useCallback(() => <ViewLogModalContent data={logEntries} mutator={mutateLogEntries} />, [logEntries, mutateLogEntries]);
  const [logDetail, setLogDetailVisible] = useModal('Details anzeigen', content);

  const openDialog = useCallback(() => {
    setLogDetailVisible(true);
  }, [setLogDetailVisible]);

  return (
    <>
      <ActionButton onClick={openDialog}>
        Details anzeigen
      </ActionButton>
      {logDetail}
    </>
  );
}

function DsgvoAcceptForm({
  isSigned,
  onSubmit,
  dsgvo,
  children,
}: {
  isSigned: boolean,
  onSubmit: (data: DsgvoAccept, setErrors: UseFormSetError<DsgvoAccept>, clearErrors: UseFormClearErrors<DsgvoAccept>, event?: React.BaseSyntheticEvent) => unknown,
  dsgvo: string | null,
  children: ReactNode
}) {
  const isDisplayDsgvoCheckbox = dsgvo === undefined || dsgvo === null || dsgvo.length === 0;

  return (
    <Form<DsgvoAccept>
      initialValue={{ dsgvo: isDisplayDsgvoCheckbox || isSigned }}
      resolver={reviewResolver}
      onSubmit={onSubmit}
    >
      {({
        errors,
        isValid,
        isSubmitting,
      }, register, control) => (
        <>

          {dsgvo !== null
           && (
             <div className="inline-flex">
               <CheckboxInput
                 {...register('dsgvo')}
                 control={control}
                 disabled={isSigned}
                 label={<Markdown className="my-4 ml-2 inline" content={dsgvo} />}
               />
             </div>
           )}
          <SubmitButton
            errors={errors}
            isSubmitting={isSubmitting}
            disabled={isSigned || !isValid}
            className="bg-primary text-onPrimary"
          >
            {isSigned ? 'Bereits unterschrieben' : 'Jetzt unterschreiben'}
          </SubmitButton>

          {children}
        </>
      )}
    </Form>
  );
}

function ViewLogModalContent({
  data,
  mutator,
}: { data?: Array<LogEntry>, mutator: KeyedMutator<Array<LogEntry>> }) {
  useEffect(() => {
    mutator();
  }, [mutator]);
  return (
    <>
      {data === undefined && <LargeLoadingIndicator />}
      {data !== undefined && (
        <div className="xxl:grid-cols-3 grid gap-2 md:grid-cols-2">
          {data.map(({
            log_type: type,
            timestamp,
            email: curEmail,
          }) => (
            <Card key={timestamp + type}>
              <h3>{curEmail}</h3>
              <Badge className="my-1 inline-flex items-center justify-center">{type}</Badge>
              <span className="text-center text-sm">
                <FormattedDateTime dateString={timestamp} />
              </span>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
