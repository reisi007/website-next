import { KeyedMutator } from 'swr/_internal';
import { useCallback, useEffect, useMemo } from 'react';
import { Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  LogEntry, LogType, SignStatus, useGetLogEntries, usePutLogEntry, useSignStatus,
} from '../api/contract.api';
import { LargeLoadingIndicator, Loadable } from '../images-next/host/Loadable';
import { useModal } from '../images-next/utils/Modal';
import { FormattedDateTime } from '../images-next/utils/Age';
import { ActionButton, SubmitButton } from '../images-next/button/ActionButton';
import { Markdown } from '../images-next/utils/Markdown';
import { ExtSubmitHandler, Form } from '../images-next/form/Form';
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

type DsgvoAccept = { dsgvo: string, server?: string };
const reviewResolver: Resolver<DsgvoAccept> = yupResolver(yup.object({
  dsgvo: yup.boolean()
    .required('Die Zustimmung zu den Datenschutzbedingungen ist nicht optional'),
}));

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

  const logEntires = useGetLogEntries(email, uuid);
  const rawPutLogEntry = usePutLogEntry<DsgvoAccept>(email, uuid, '...', logEntires.mutate);
  const putLogEntry = useCallback((l: LogType) => {
    rawPutLogEntry(l, () => {
    }, () => {
    });
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

  const content = useCallback(() => <ViewLogModalContent data={logEntires.data} mutator={logEntires.mutate} />, [logEntires.data, logEntires.mutate]);
  const [logDetail, setLogDetailVisible] = useModal('Details anzeigen', content);

  const dialogOpen = useCallback(() => {
    setLogDetailVisible(true);
  }, [setLogDetailVisible]);
  const isDisplayDsgvoCheckbox = dsgvo === undefined || dsgvo === null || dsgvo.length === 0;
  return (
    <div className="grid gap-2">
      <Form<DsgvoAccept>
        initialValue={{ dsgvo: isDisplayDsgvoCheckbox || isSigned ? 'true' : 'false' }}
        resolver={reviewResolver}
        onSubmit={signAction}
      >
        {({
          errors,
          isSubmitting,
        }, register, control) => (
          <>

            {dsgvo !== null
             && (
               <div className="inline-flex">
                 <CheckboxInput
                   {...register('dsgvo')}
                   required
                   control={control}
                   disabled={isSigned}
                   label={<Markdown className="my-4 ml-2 inline" content={dsgvo} />}
                 />
               </div>
             )}
            <div className="flex justify-evenly">
              <SubmitButton
                errors={errors}
                isSubmitting={isSubmitting}
                disabled={isSigned}
                className="bg-primary text-onPrimary"
              >
                {isSigned ? 'Bereits unterschrieben' : 'Jetzt untersschrieben'}
              </SubmitButton>

              <ActionButton onClick={dialogOpen}>
                Details anzeigen
              </ActionButton>
            </div>
            {logDetail}
          </>

        )}
      </Form>
    </div>
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
