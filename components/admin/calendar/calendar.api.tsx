import { LoginResponse } from '../AdminLoginForm';
import { useAdminGet } from '../../utils/swr';

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

export function usePrivateCalendarData(lr:LoginResponse) {
  return useAdminGet<Array<ShootingDateEntry>>('shooting_dates_private_get.php', lr);
}
