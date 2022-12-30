import useSWR, { SWRResponse } from 'swr';
import { useCallback, useMemo } from 'react';
import { KeyedMutator } from 'swr/_internal';
import dayjs from 'dayjs';
import { ROOT_URL, sendPost } from '../images-next/host/Rest';
import { JSON_FETCHER } from '../swr/Fetcher';
import { PdoEmulatedPrepared } from './PdoEmulatedPrepared';

export function useLoadContract(email: string, uuid: string) {
  const init: RequestInit = {
    headers: {
      Email: email,
      AccessKey: uuid,
    },
  };
  return useSWR<ContractData, unknown, [string, RequestInit]>([`${ROOT_URL}api/contract_get.php`, init], JSON_FETCHER);
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

function createHeader(email: string, uuid: string): RequestInit {
  return {
    headers: {
      Email: email,
      AccessKey: uuid,
    },
  };
}

export function useSignStatus(email: string, uuid: string) :SWRResponse<Array<SignStatus>, unknown> {
  const {
    data: rawData,
    mutate: rawMutate,
    ...swr
  } = useSWR<PdoEmulatedPrepared<Array<SignStatus>>, unknown, [string, RequestInit]>([
    `${ROOT_URL}api/contract-signed_status_get.php`, createHeader(email, uuid),
  ], JSON_FETCHER);

  function mapData(d: PdoEmulatedPrepared<SignStatus>): SignStatus {
    return {
      ...d,
      signed: d.signed === '1',
    };
  }

  const data = useMemo((): Array<SignStatus> | undefined => {
    if (rawData === undefined) {
      return undefined;
    }
    return rawData.map(mapData);
  }, [rawData]);

  const mutate: KeyedMutator<Array<SignStatus>> = useCallback(() => rawMutate().then((e) => e?.map((d) => mapData(d))), [rawMutate]);
  return {
    ...swr,
    data,
    mutate,
  };
}

export function useGetLogEntries(email:string, uuid:string): SWRResponse<Array<LogEntry>, unknown> {
  const {
    data: rawData,
    mutate: rawMutate,
    ...swr
  } = useSWR<PdoEmulatedPrepared<Array<LogEntry>>, unknown, [string, RequestInit]>([

    `${ROOT_URL}/api/contract-log_get.php`,
    createHeader(email, uuid),
  ], JSON_FETCHER);

  function getData(e : PdoEmulatedPrepared<LogEntry>): LogEntry {
    return {
      ...e,
      log_type: e.log_type as LogType,
    };
  }

  const data = useMemo(() => {
    if (rawData === undefined) return undefined;

    return rawData.map(getData);
  }, [rawData]);

  const mutate: KeyedMutator<Array<LogEntry>> = useCallback(() => rawMutate().then((e) => e?.map(getData)), [rawMutate]);

  return {
    data,
    mutate,
    ...swr,
  };
}

type PutLogEntryBody = { action: LogType, baseUrl: string };

export function usePutLogEntry(email:string, uuid:string, hash:string, dataMutator: KeyedMutator<Array<LogEntry>>): (action:PutLogEntryBody['action'])=>Promise<unknown> {
  return useCallback((action) => sendPost<PutLogEntryBody>('contract-log_put.php', { action, baseUrl: computeContractLink(email, uuid) })
    .then(() => dataMutator((old) => {
      const newVar: Array<LogEntry> = old ?? [];
      newVar.push({
        email, hash_value: hash, log_type: action, timestamp: dayjs().toISOString(),
      });
      return newVar;
    })), [dataMutator, email, hash, uuid]);
}

export function computeContractLink(email:string, uuid:string) {
  return `${window.location.protocol}//${window.location.host}/contracts?email=${email}&accessKey=${uuid}`;
}

export type LogEntry = {
  email: string,
  timestamp: string,
  log_type: LogType,
  hash_value: string
};

export type LogType = 'OPEN' | 'SIGN';
