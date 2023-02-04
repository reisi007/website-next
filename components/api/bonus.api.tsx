import { SWRResponse } from 'swr';
import { useGet } from '../utils/swr';
import { PdoEmulatedPrepared } from './PdoEmulatedPrepared';
import { Person } from '../admin/contract/ContractData';

export type BonusPersonWithTotal = Person & { id: string, tel: string, total: number, pin: string };

export type BonusProgramDetailsResponse = {
  used:Array<BonusProgramDetailsEntry>,
  unused:Array<BonusProgramDetailsEntry>
};

export type BonusProgramDetailsEntry = {
  rawId: number,
  text: string,
  value: number,
  expireAt: string
  used?:string
};

export function useGetBonusProgramMember(id: string, pin: string): SWRResponse<BonusPersonWithTotal> {
  return useGet<PdoEmulatedPrepared<BonusPersonWithTotal>>(`bonus_person_get.php?id=${id}&pin=${pin}`);
}

export function useGetBonusProgramMemberDetails(id: string, pin: string): SWRResponse<BonusProgramDetailsResponse> {
  return useGet<PdoEmulatedPrepared<BonusProgramDetailsResponse>>(`bonus_persons_entries_get.php?id=${id}&pin=${pin}`);
}
