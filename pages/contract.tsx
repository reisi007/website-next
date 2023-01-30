import { useRouter } from 'next/router';
import { WebPage } from '../components/WebPage';
import { ensureString } from '../components/images-next/form/Url2Form';
import { useLoadContract } from '../components/api/contract.api';
import { DisplayContract } from '../components/contract/DisplayContract';
import { LargeLoadingIndicator } from '../components/images-next/host/Loadable';
import { SignAction } from '../components/contract/SignAction';

export default function Contract() {
  const {
    email,
    accessKey,
  } = useRouter().query;

  const emailStringValue = ensureString(email);
  const accessKeyStringValue = ensureString(accessKey);
  return (
    <WebPage showContactForm={false} title="Vertrag unterschreiben">
      <div className="p">
        {emailStringValue === undefined || accessKeyStringValue === undefined ? <LargeLoadingIndicator />
          : <ContractContent email={emailStringValue} uuid={accessKeyStringValue} />}
      </div>
    </WebPage>
  );
}

function ContractContent({
  email,
  uuid,
}: { email: string, uuid: string }): JSX.Element {
  const { data, error } = useLoadContract(email, uuid);

  if (error) return <div className="text-error">Kein Vertrag mit diesen Daten gefunden</div>;
  if (!data) return <LargeLoadingIndicator />;

  return (
    <>
      <DisplayContract contractData={data} />
      <SignAction email={email} uuid={uuid} dsgvo={data.dsgvo_markdown} />
    </>
  );
}
