import { SWRResponse } from 'swr';
import { useCallback, useMemo } from 'react';
import { KeyedMutator } from 'swr/_internal';
import { useAdminGet } from '../../utils/swr';
import { PdoEmulatedPrepared } from '../../api/PdoEmulatedPrepared';
import { ExtSubmitHandler } from '../../images-next/form/Form';
import { JwtRequestHeaders } from '../AdminLoginForm';
import { useManualFetch } from '../../images-next/host/Rest';
import { BonusPersonWithTotal, BonusProgramDetailsEntry, BonusProgramDetailsResponse } from '../../api/bonus.api';

export function useGetBonusProgramMembers(jwt: string): SWRResponse<Array<BonusPersonWithTotal>> {
  return useAdminGet<PdoEmulatedPrepared<Array<BonusPersonWithTotal>>>('bonus_persons_get.php', jwt);
}

export type PutBonusEntry = {
  id: number,
  text: string,
  value: number,
  expireAt: string
  server?: string
};

export function useCreateBonusApiEntry(
  jwt: string,
  id: number,
  mutateTotal: KeyedMutator<BonusPersonWithTotal>,
  mutateDetails: KeyedMutator<BonusProgramDetailsResponse>,
): ExtSubmitHandler<PutBonusEntry> {
  const headers: JwtRequestHeaders = useMemo(() => ({
    Authorization: `Bearer: ${jwt}`,
  }), [jwt]);

  const action = useManualFetch<PutBonusEntry>('api/bonus_entry_put.php', 'put', headers);
  return useCallback(
    (setErrors, clearErrors, data) => action(setErrors, clearErrors, undefined, {
      ...data,
      id,
    })
      .then(() => {
        mutateTotal((cur) => {
          if (cur === undefined) return undefined;
          return {
            ...cur,
            total: Math.round(100 * (cur.total + data.value)) / 100,
          };
        });

        mutateDetails((cur) => {
          if (cur === undefined) return undefined;
          return {
            ...cur,
            unused: cur.unused.splice(0, 0, {
              ...data,
              rawId: -1,
            }),
          };
        });
      }),
    [action, id, mutateDetails, mutateTotal],
  );
}

export function useDeleteBonusApiEntry(jwt: string, customMutator: (removed: BonusProgramDetailsEntry) => void): ExtSubmitHandler<BonusProgramDetailsEntry & { server?: string }> {
  const headers: JwtRequestHeaders = useMemo(() => ({
    Authorization: `Bearer: ${jwt}`,
  }), [jwt]);

  const action = useManualFetch<BonusProgramDetailsEntry & { server?: string }>('api/bonus_entry_delete.php', 'put', headers);

  return useCallback((setErrors, clearErrors, data) => {
    action(setErrors, clearErrors, undefined, data)
      .then((_) => customMutator(data));
  }, [action, customMutator]);
}
