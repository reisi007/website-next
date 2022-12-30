import { SWRResponse } from 'swr';
import { ReactNode } from 'react';
import { LoadingIndicator } from '../rest/LoadingIndicator';

export function Loadable<Data, Error>({ data, error, children }: SWRResponse<Data, Error> & { children: (date:Data) => ReactNode }):JSX.Element {
  if (error) return <div className="text-error">{JSON.stringify(error)}</div>;
  if (data === undefined) return <LargeLoadingIndicator />;
  return <>{children(data)}</>;
}

export function LargeLoadingIndicator() {
  return <LoadingIndicator className="my-8" height="20rem" />;
}
