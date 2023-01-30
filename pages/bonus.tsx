import { DeepPartial } from 'react-hook-form';
import { useRouter } from 'next/router';
import MarkdownText from '../components/text/publicBonusProgram.mdx';
import { WebPage } from '../components/WebPage';
import { ContactFormMessage } from '../components/images-next/form/ContactForm';
import { BonusProgrammLoginUser } from '../components/bonus/BonusProgrammLoginUser';
import { ensureString } from '../components/images-next/form/Url2Form';
import { BonusPersonWithTotal, useGetBonusProgramMember } from '../components/api/bonus.api';
import { Loadable } from '../components/images-next/host/Loadable';
import { BonusProgramDetails, BonusProgramHeader } from '../components/bonus/BonusProgramHeader';
import DetailsText from '../components/text/bedingungenBonusProgramm.mdx';

const prefilled : DeepPartial<ContactFormMessage> = {
  subject: 'Anmeldung für das Bonusprogramm',
  message: 'Ich möchte mich für das Bonusprogramm anmelden',
};

export default function RegisterForBonusProgramm() {
  const { id, pin } = useRouter().query;
  const idString = ensureString(id);
  const pinString = ensureString(pin);
  const isLoggedIn = idString !== undefined && pinString !== undefined;
  return (
    <>
      { !isLoggedIn && (
      <WebPage title="Informationen zum Bonusprogramm" prefilledContractForm={prefilled}>
        <MarkdownText />
        <BonusProgrammLoginUser />
        <div className="m-4 text-sm">
          <DetailsText />
        </div>
      </WebPage>
      )}
      {isLoggedIn && (
        <WebPage title="Status Bonusprogramm">
          <BonusProgramLoadContent id={idString} pin={pinString} />
        </WebPage>
      )}
    </>
  );
}

function BonusProgramLoadContent({ id, pin }:{ id:string, pin:string }) {
  const data = useGetBonusProgramMember(id, pin);
  return (
    <Loadable {...data}>
      { (res) => <BonusProgramContent person={res} />}
    </Loadable>
  );
}

function BonusProgramContent({ person }:{ person: BonusPersonWithTotal }) {
  return (
    <>
      <BonusProgramHeader entry={person} />
      <BonusProgramDetails id={person.id} pin={person.pin} />
    </>
  );
}
