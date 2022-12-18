import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import classNames from 'classnames';
import { EmpP } from '../components/EmpP';
import { Page } from '../components/page/Page';
import { MetadataMap, readMultipleImages } from '../components/static/readImage';
import { ImageCaroussel } from '../components/caroussel/ImageCaroussel';
import { MyImage } from '../components/utils/MyImage';

export default function Vision({ firstCaroussel }:InferGetStaticPropsType<typeof getStaticProps>) {
  const buttonClassName = classNames('button black rounded-xl bg-primary p-4 text-white');
  return (
    <Page title="Meine Vision">
      <EmpP>
        Fotografie ist schon seit über 6 Jahren meine größte Leidenschaft.
        Zehn tausende Bilder bzw. 150 erfolgreiche Fotoshootings später durfte ich mit vielen glücklichen Models Erfahrungen sammeln.
      </EmpP>
      <p>
        Meine Spezialisierung sehe ich in der Beauty Fotografie, wobei ich da auch intimere Bilder darunter verstehe, die man normalerweise
        nicht, oder nur mit einer kleinen Gruppe von Menschen teilt.
      </p>
      <ImageCaroussel className="w-full" metadataMap={firstCaroussel} />
      <EmpP>
        Ziel ist es, dass ich während des Fotoshootings eine Umgebung schaffe, in der sich das Model entspannen kann, sich wohl fühlt und so sein kann, wie sie eben ist.
        Denn erst dann ist es mir möglich dem Model ihre natürliche Schönheit zu zeigen, ihren Körper in seiner Gesamtheit kennen zu lernen und dadurch
        ihr Selbstbewusstsein im Alltag zu steigern.
      </EmpP>
      <MyImage />
      <p>
        Wie man schon ganz sicher raus gehört hat, ist mein Antrieb in der Beauty Fotografie der abgebildeten Person eine Freude zu bereiten.
        Ich nehme mir ausreichend Zeit in der Vorbereitung, während des Shootings und auch danach bei der Auswahl und der Bearbeitung der Bilder mit dir, um dir eine richtig
        coole Erfahrung zu ermöglichen und damit du lange durch die Bilder auf das gemeinsame Shooting erinnert wirst.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Link href="/edit" className={buttonClassName}>Wie bearbeite ich Fotos</Link>
        <Link href="/edit" className={buttonClassName}>Wie bearbeite ich Fotos</Link>
      </div>
    </Page>
  );
}

const FIRST_CAROUSSEL = [
  'SarahFrick007', 'AnnaWirth07', 'JuliaEder009', 'Boudoir0021',
] as const;
type FirstCarousselType = typeof FIRST_CAROUSSEL[number];
export const getStaticProps: GetStaticProps<{ [key:string]: MetadataMap<FirstCarousselType> }> = async () => ({
  props: {
    firstCaroussel: await readMultipleImages([...FIRST_CAROUSSEL]),
  },
});
