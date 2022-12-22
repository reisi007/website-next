import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import classNames from 'classnames';
import { MyImage } from '../components/utils/MyImage';
import { getMoreImages } from '../components/static/moreImages';
import { EmpP } from '../components/images-next/EmpP';
import { ImageCaroussel } from '../components/images-next/caroussel/ImageCaroussel';
import { Gallery } from '../components/images-next/gallery/Gallery';
import { ImageInfo, MetadataMap } from '../components/images-next/types/ImageTypes';
import { PortfolioPage } from '../components/PortfolioPage';
import { readMultipleImages } from '../components/static/readImage';

export default function Vision({
  caroussel,
  moreImages,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const buttonClassName = classNames('button black rounded-xl bg-primary p-4 text-white');
  return (
    <PortfolioPage title="Meine Vision">
      <EmpP>
        Fotografie ist schon seit über 6 Jahren meine größte Leidenschaft.
        Zehn tausende Bilder bzw. 150 erfolgreiche Fotoshootings später durfte ich mit vielen glücklichen Models Erfahrungen sammeln.
      </EmpP>
      <p>
        Meine Spezialisierung sehe ich in der Beauty Fotografie, wobei ich da auch intimere Bilder darunter verstehe, die man normalerweise
        nicht, oder nur mit einer kleinen Gruppe von Menschen teilt.
      </p>
      <ImageCaroussel metadataMap={caroussel} />
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
      <div className="grid grid-cols-1 space-x-2 text-center lg:grid-cols-2">
        <Link href="/edit" className={buttonClassName}>Wie bearbeite ich Fotos</Link>
        <Link href="/edit" className={buttonClassName}>Wie bearbeite ich Fotos</Link>
      </div>
      <Gallery className="mt-4" images={moreImages} />
    </PortfolioPage>
  );
}

const FIRST_CAROUSSEL = [
  'SarahFrick007', 'AnnaWirth07', 'JuliaEder009', 'Boudoir0021',
] as const;
type FirstCarousselType = typeof FIRST_CAROUSSEL[number];
export const getStaticProps: GetStaticProps<{ caroussel: MetadataMap<FirstCarousselType>, moreImages: Array<[string, ImageInfo]> }> = async () => ({
  props: {
    caroussel: await readMultipleImages([...FIRST_CAROUSSEL]),
    moreImages: await getMoreImages(),
  },
});
