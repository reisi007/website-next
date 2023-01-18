import { SWRResponse } from 'swr';
import { useCallback, useMemo } from 'react';
import { KeyedMutator } from 'swr/_internal';
import { JwtRequestHeaders } from '../AdminLoginForm';
import { useAdminGet } from '../../utils/swr';
import { formatDate } from '../../images-next/utils/Age';
import { useManualFetch } from '../../images-next/host/Rest';
import { CreateContractForm, Person } from './ContractData';
import { ExtSubmitHandler } from '../../images-next/form/Form';

export type SearchablePerson = Person & { search: string };

function mapPerson(p: Person): SearchablePerson {
  return {
    ...p,
    search: `${p.firstName?.toLowerCase()} ${p.lastName.toLowerCase()} ${p.email.toLowerCase()} ${formatDate(p.birthday)}`,
  };
}

export function useKnownPersons(jwt: string): SWRResponse<Array<SearchablePerson>> {
  const {
    data: rawData,
    mutate: rawMutate,
    ...rest
  } = useAdminGet<Array<Person>>('contract-people_get.php', jwt);

  const data: Array<SearchablePerson> | undefined = useMemo(() => rawData?.map(mapPerson), [rawData]);

  const mutate: KeyedMutator<Array<SearchablePerson>> = useCallback(() => rawMutate()
    .then((nextData) => nextData?.map(mapPerson)), [rawMutate]);

  return {
    data,
    mutate,
    ...rest,
  };
}

export function useContractFilenames(jwt: string): SWRResponse<Array<string>> {
  return useAdminGet<Array<string>>('contract-templates_get.php', jwt);
}

export function useCreateContract(jwt: string): ExtSubmitHandler<CreateContractForm> {
  const headers: JwtRequestHeaders = useMemo(() => ({
    Authorization: `Bearer: ${jwt}`,
  }), [jwt]);
  const action = useManualFetch<CreateContractForm>('contract_put.php', 'put', headers);
  return useCallback((setErrors, clearErrors, data) => action(setErrors, clearErrors, undefined, data), [action]);
}
