import { useCallback, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { KeyedMutator } from 'swr/_internal';
import { PdoEmulatedPrepared } from '../../api/PdoEmulatedPrepared';
import { LoginResponse } from '../AdminLoginForm';
import { Review } from '../../form/Rest';
import { JSON_FETCHER } from '../../swr/Fetcher';
import { ROOT_URL } from '../../images-next/host/Rest';

export type LoadedReview = Omit<Review, 'firstName' | 'lastName'> & {
  creation_date: string;
  name:string;
  rating?:number;
};

export function useGetAllReviews({ user, hash }: LoginResponse): SWRResponse<Array<LoadedReview>> {
  const init: RequestInit = useMemo(() => ({
    headers: {
      Email: user,
      AccessKey: hash,
    },
  }), [hash, user]);
  const { data: rawData, mutate: rawMutate, ...rest } = useSWR<PdoEmulatedPrepared< Array<LoadedReview>>, unknown, [string, RequestInit]>(
    [`${ROOT_URL}api/reviews-admin_get.php`, init],
    JSON_FETCHER,
  );

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
