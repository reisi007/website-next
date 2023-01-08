import useSWR, { SWRResponse } from 'swr';
import { useMemo } from 'react';
import { LoginResponse } from '../AdminLoginForm';
import { ROOT_URL } from '../../images-next/host/Rest';
import { JSON_FETCHER } from '../../swr/Fetcher';

export type ShootingDateEntry = {
  kw: number,
  state: ShootingSlotState,
  text?: string
};

export enum ShootingSlotState {
  FREE = 'FREE',
  BUSY = 'BUSY',
  TAKEN = 'TAKEN',
  BLOCKED = 'BLOCKED',
  NOT_YET_OPENED = 'NOT YET OPENED',
}

export function usePrivateCalendarData({ user, hash }:LoginResponse): SWRResponse<Array<ShootingDateEntry>> {
  const init: RequestInit = useMemo(() => ({
    headers: {
      Email: user,
      AccessKey: hash,
    },
  }), [hash, user]);
  return useSWR<Array<ShootingDateEntry>, unknown, [string, RequestInit]>([`${ROOT_URL}api/shooting_dates_private_get.php`, init], JSON_FETCHER);
}
