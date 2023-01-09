import { SWRResponse } from 'swr';
import { useCallback, useMemo } from 'react';
import { KeyedMutator } from 'swr/_internal';
import dayjs from 'dayjs';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form/dist/types/form';
import { ServerError, useManualFetch } from '../images-next/host/Rest';
import { PdoEmulatedPrepared } from './PdoEmulatedPrepared';
import { useAuthedGet } from '../utils/swr';

export function useLoadContract(email: string, uuid: string) {
  return useAuthedGet<ContractData>('contract_get.php', email, uuid);
}

export type ContractData = {
  access_key: string,
  email: string,
  firstname: string,
  lastname: string,
  birthday: string,
  markdown: string,
  dsgvo_markdown: string | null,
  hash_algo: string,
  hash_value: string,
  due_date: string
};

export type SignStatus = {
  email: string,
  firstname: string,
  lastname: string,
  birthday: string,
  signed: boolean
};

export function useSignStatus(email: string, uuid: string): SWRResponse<Array<SignStatus>, Response> {
  const {
    data: rawData,
    mutate: rawMutate,
    ...swr
  } = useAuthedGet<PdoEmulatedPrepared<Array<SignStatus>>>('contract-signed_status_get.php', email, uuid);

  function mapData(d: PdoEmulatedPrepared<SignStatus>): SignStatus {
    return {
      ...d,
      signed: d.signed === 1,
    };
  }

  const data = useMemo((): Array<SignStatus> | undefined => {
    if (rawData === undefined) {
      return undefined;
    }
    return rawData.map(mapData);
  }, [rawData]);

  const mutate: KeyedMutator<Array<SignStatus>> = useCallback(() => rawMutate()
    .then((e) => e?.map((d) => mapData(d))), [rawMutate]);
  return {
    ...swr,
    data,
    mutate,
  };
}

export function useGetLogEntries(email: string, uuid: string): SWRResponse<Array<LogEntry>, Response> {
  const {
    data: rawData,
    mutate: rawMutate,
    ...swr
  } = useAuthedGet<PdoEmulatedPrepared<Array<LogEntry>>>(
    'contract-log_get.php',
    email,
    uuid,
  );

  function getData(e: PdoEmulatedPrepared<LogEntry>): LogEntry {
    return {
      ...e,
      log_type: e.log_type as LogType,
    };
  }

  const data = useMemo(() => {
    if (rawData === undefined) return undefined;

    return rawData.map(getData);
  }, [rawData]);

  const mutate: KeyedMutator<Array<LogEntry>> = useCallback(() => rawMutate()
    .then((e) => e?.map(getData)), [rawMutate]);

  return {
    data,
    mutate,
    ...swr,
  };
}

type PutLogEntryBody = { action: LogType, server?: string };

export function usePutLogEntry<Error extends ServerError>(email: string, uuid: string, hash: string, dataMutator: KeyedMutator<Array<LogEntry>>):
(b: LogType, setErrors: UseFormSetError<Error>, clearError: UseFormClearErrors<Error>) => Promise<unknown> {
  const header = useMemo(() => ({
    Email: email,
    AccessKey: uuid,
  }), [email, uuid]);
  const rawAction = useManualFetch<Error, unknown, undefined, PutLogEntryBody>('api/contract-log_put.php', 'put', header);

  return useCallback((logType, setErrors, clearError) => rawAction(setErrors, clearError, undefined, { action: logType })
    .then(() => dataMutator((old) => {
      const newVar: Array<LogEntry> = old ?? [];
      newVar.push({
        email,
        hash_value: hash,
        log_type: logType,
        timestamp: dayjs().toISOString(),
      });
      return newVar;
    })), [rawAction, dataMutator, email, hash]);
}

export type LogEntry = {
  email: string,
  timestamp: string,
  log_type: LogType,
  hash_value: string
};

export type LogType = 'OPEN' | 'SIGN';
