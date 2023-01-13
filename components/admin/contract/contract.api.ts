import { SWRResponse } from 'swr';
import { useCallback, useMemo } from 'react';
import { KeyedMutator } from 'swr/_internal';
import { LoginRequestHeaders, LoginResponse } from '../AdminLoginForm';
import { useAdminGet } from '../../utils/swr';
import { formatDate } from '../../images-next/utils/Age';
import { useManualFetch } from '../../images-next/host/Rest';
import { CreateContractForm, Person } from './ContractData';
import { ExtSubmitHandler } from '../../images-next/form/Form';

export type SearchablePerson = Person & { search: string };

function mapPerson(p: Person):SearchablePerson {
  return {
    ...p,
    search: `${p.firstName?.toLowerCase()} ${p.lastName.toLowerCase()} ${p.email.toLowerCase()} ${formatDate(p.birthday)}`,
  };
}

export function useKnownPersons(loginResponse: LoginResponse): SWRResponse<Array<SearchablePerson>> {
  const {
    data: rawData,
    mutate: rawMutate,
    ...rest
  } = useAdminGet<Array<Person>>('contract-people_get.php', loginResponse);

  const data: Array<SearchablePerson> | undefined = useMemo(() => rawData?.map(mapPerson), [rawData]);

  const mutate: KeyedMutator<Array<SearchablePerson>> = useCallback(() => rawMutate().then((nextData) => nextData?.map(mapPerson)), [rawMutate]);

  return {
    data,
    mutate,
    ...rest,
  };
}

export function useContractFilenames(loginResponse: LoginResponse):SWRResponse<Array<string>> {
  return useAdminGet<Array<string>>(
    'contract-templates_get.php',
    loginResponse,
  );
}

export function useCreateContract(loginResponse: LoginResponse): ExtSubmitHandler<CreateContractForm> {
  const headers : LoginRequestHeaders = useMemo(() => ({
    Email: loginResponse.user,
    Accesskey: loginResponse.hash,
  }), [loginResponse.hash, loginResponse.user]);
  const action = useManualFetch<CreateContractForm>('contract_put.php', 'put', headers);
  return useCallback((setErrors, clearErrors, data) => action(setErrors, clearErrors, undefined, data), [action]);
}
