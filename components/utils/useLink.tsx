import { useRouter } from 'next/router';
import { useMemo } from 'react';

export function useLink(path:string): string {
  const router = useRouter();
  return useMemo(() => `${router.basePath}/${path}`, [router, path]);
}
