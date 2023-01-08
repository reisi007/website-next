import useSWR, { SWRResponse } from 'swr';
import { LoginResponse } from '../AdminLoginForm';
import { JSON_FETCHER } from '../../swr/Fetcher';
import { ROOT_URL, useCreateHeader } from '../../images-next/host/Rest';

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
  return useSWR<Array<ShootingDateEntry>, unknown, [string, RequestInit]>([`${ROOT_URL}api/shooting_dates_private_get.php`, useCreateHeader(user, hash)], JSON_FETCHER);
}
