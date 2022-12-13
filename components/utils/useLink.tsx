import { useRouter } from 'next/router';

export function useLink(path:string): string {
  const router = useRouter();
  return `${router.basePath}/${path}`;
}
