import { useEffect } from 'react';
import useSWR from 'swr';
import { ROOT_URL } from '../images-next/host/Rest';
import { JSON_AUTHED_FETCHER, JSON_FETCHER, JSON_JWT_FETCHER } from '../swr/Fetcher';
import { useAdminLogout } from '../admin/AdminLogoutContext';

export function useAuthedGet<Response>(path:string, user:string, hash:string) {
  const url = `${ROOT_URL}api/${path}`;
  return useSWR<Response, Error, [string, string, string]>(
    [url, user, hash],
    JSON_AUTHED_FETCHER,
  );
}

export function useGet<Response>(path:string) {
  const url = `${ROOT_URL}api/${path}`;
  return useSWR<Response, Error, [string]>(
    [url],
    JSON_FETCHER,
  );
}

export function useAdminGet<Response>(path:string, jwt:string) {
  const url = `${ROOT_URL}api/${path}`;

  const { error, ...rest } = useSWR<Response, Error, [string, string]>(
    [url, jwt],
    JSON_JWT_FETCHER,
  );

  const adminLogout = useAdminLogout();

  useEffect(() => {
    if (error && error.name === '401') adminLogout();
  }, [adminLogout, error]);

  return { error, ...rest };
}
