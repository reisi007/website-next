import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { ROOT_URL } from '../images-next/host/Rest';
import { JSON_FETCHER } from '../swr/Fetcher';
import { LoginResponse } from '../admin/AdminLoginForm';
import { useAdminLogout } from '../admin/AdminLogoutContext';

export function useAuthedGet<Response>(path:string, user:string, hash:string) {
  const url = `${ROOT_URL}api/${path}`;
  const init: RequestInit = useMemo(() => ({
    headers: {
      Email: user,
      AccessKey: hash,
    },
  }), [hash, user]);
  return useSWR<Response, globalThis.Response, [string, RequestInit]>(
    [url, init],
    JSON_FETCHER,
  );
}

export function useAdminGet<Response>(path:string, loginResponse:LoginResponse) {
  const url = `${ROOT_URL}api/${path}`;
  const init: RequestInit = useMemo(() => ({
    headers: {
      Email: loginResponse.user,
      AccessKey: loginResponse.hash,
    },
  }), [loginResponse.hash, loginResponse.user]);

  const { error, ...rest } = useSWR<Response, globalThis.Response, [string, RequestInit]>(
    [url, init],
    JSON_FETCHER,
  );

  const adminLogout = useAdminLogout();

  useEffect(() => {
    if (error && error.status === 401) adminLogout();
  }, [adminLogout, error]);

  return { error, ...rest };
}
