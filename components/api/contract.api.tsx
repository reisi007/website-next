import useSWR, { SWRResponse } from 'swr';
import { useCallback, useMemo } from 'react';
import { KeyedMutator } from 'swr/_internal';
import dayjs from 'dayjs';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form/dist/types/form';
import {
  ROOT_URL, ServerError, useCreateHeader, useManualFetch,
} from '../images-next/host/Rest';
import { JSON_FETCHER } from '../swr/Fetcher';
import { PdoEmulatedPrepared } from './PdoEmulatedPrepared';

export function useLoadContract(email: string, uuid: string) {
  return useSWR<ContractData, unknown, [string, RequestInit]>([`${ROOT_URL}api/contract_get.php`, useCreateHeader(email, uuid)], JSON_FETCHER);
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

export function useSignStatus(email: string, uuid: string): SWRResponse<Array<SignStatus>, unknown> {
  const {
    data: rawData,
    mutate: rawMutate,
    ...swr
  } = useSWR<PdoEmulatedPrepared<Array<SignStatus>>, unknown, [string, RequestInit]>([
    `${ROOT_URL}api/contract-signed_status_get.php`, useCreateHeader(email, uuid),
  ], JSON_FETCHER);

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

export function useGetLogEntries(email: string, uuid: string): SWRResponse<Array<LogEntry>, unknown> {
  const {
    data: rawData,
    mutate: rawMutate,
    ...swr
  } = useSWR<PdoEmulatedPrepared<Array<LogEntry>>, unknown, [string, RequestInit]>([
    `${ROOT_URL}/api/contract-log_get.php`,
    useCreateHeader(email, uuid),
  ], JSON_FETCHER);

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
