import { WebPage } from '../components/WebPage';
import { StyledLinkButton } from '../components/images-next/button/StyledButton';

const TALKING_POINTS: Array<{ title:string, text:string }> = [
  {
    title: 'Gemeinsame Vorbesprechung',
    text: `Die Vorbesprechung ermöglicht es uns, uns schon vor dem Fotoshooting kennenzulernen und deine Wünsche besprechen.
    Da wir uns dann schon etwas kennen, ist die Nervosität am Tag des Fotoshootings geringer`,
  }, {
    title: 'Fotoshooting',
    text: 'Fotoshooting (1,5h - 3h) Outdoor oder bei mir mit Studioequipment',
  }, {
    title: 'Gemeinsame Fotoauswahl',
    text: 'Gemeinsames auswählen der besten Fotos aus dem Shooting (10-20 Fotos)',
  }, {
    title: 'Professionelle Nachbearbeitung',
    text: 'Professionelle Nachbearbeitung aller Fotos, die du bekommst',
  },
];

export default function Offer() {
  return (
    <WebPage title="Angebot">
      <div className="m-8 rounded-2xl bg-primary p-4 text-onPrimary">
        <h2 className="pb-2 text-2xl">Fotoshooting</h2>
        <ul className="mx-auto text-lg md:w-2/3 lg:w-1/2">
          {
            TALKING_POINTS.map(({ title, text }) => (
              <li key={title}>
                <h3 className="inline-block">{title}</h3>
                <p className="ml-2 block py-0 text-base">
                  {text}
                </p>
              </li>
            ))
          }
        </ul>
        <p className="text-center font-light">
          <span className="ml-0.5 text-2xl">Unkostenbetrag: </span>
          <span className="text-6xl">100</span>
          <span className="ml-0.5 text-2xl">€</span>
        </p>
        <p className="text-center">
          Falls du an einem Fotoshooting Interesse hast, kontaktiere mich doch mit deinem Terminvorschlag
        </p>
      </div>
      <h2 className="mb-2">Bonusprogramm</h2>
      <p className="text-center">Möchtest du als Stammkunde bei Fotoshootings Geld sparen?</p>
      <div className="flex justify-center">
        <StyledLinkButton className="bg-primary text-onPrimary" href="/bonus">Erfahre mehr über das Bonusprogramm</StyledLinkButton>
      </div>
    </WebPage>
  );
}
