import { useCallback, useMemo } from 'react';
import { SWRResponse } from 'swr';
import { KeyedMutator } from 'swr/_internal';
import { PdoEmulatedPrepared } from '../../api/PdoEmulatedPrepared';
import { Review } from '../../form/Rest';
import { useAdminGet } from '../../utils/swr';

export type LoadedReview = Omit<Review, 'firstName' | 'lastName'> & {
  creation_date: string;
  name:string;
  rating?:number;
};

export function useGetAllReviews(jwt: string): SWRResponse<Array<LoadedReview>> {
  const { data: rawData, mutate: rawMutate, ...rest } = useAdminGet<PdoEmulatedPrepared< Array<LoadedReview>>>('reviews-admin_get.php', jwt);

  function convert(data: PdoEmulatedPrepared<LoadedReview>): LoadedReview {
    return {
      ...data,
      dsgvo: data.dsgvo === 1,
    };
  }

  const data = useMemo((): Array<LoadedReview> | undefined => rawData?.map(convert), [rawData]);

  const mutate: KeyedMutator<Array<LoadedReview>> = useCallback(() => rawMutate()
    .then((e) => e?.map((d) => convert(d))), [rawMutate]);

  return { data, mutate, ...rest };
}
