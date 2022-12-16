import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { EmpP } from '../components/EmpP';
import { Page } from '../components/page/Page';
import { MetadataMap, readMultipleImages } from '../components/static/readImage';
import { ImageCaroussel } from '../components/caroussel/ImageCaroussel';

export default function Vision({ firstCaroussel }:InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page title="Meine Vision">
      <EmpP>
        Fotografie ist schon seit über 6 Jahren meine größte Leidenschaft.
        Über zehn tausende Bilder bzw. 150 erfolgreiche Fotoshootings später durfte ich mit vielen glücklichen Models Fotoshootings abhalten.
      </EmpP>

      <p>
        Meine Spezialisierung sehe ich in der Beauty Fotografie, wobei ich keine Unterscheidung mache wie viel die Personen, die ich fotografieren darf am Körper tragen -
        denn mein Ziel beim Shooting ist in jedem Fall gleich.
      </p>
      <ImageCaroussel className="w-full" metadataMap={firstCaroussel} />
      <EmpP>
        Ziel ist es, dass ich während des Fotoshootings eine Umgebung schaffe, in der sich das Model entspannen kann und wohl fühlt.
        Denn erst dann ist es mir möglich dem Model ihre natürliche Schönheit zu zeigen, ihren Körper in seiner Gesamtheit kennen zu lernen dadurch
        ihr Selbstbewusstsein im Alltag zu steigern.
      </EmpP>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<{ [key:string]: MetadataMap }> = async () => ({
  props: {
    firstCaroussel: await readMultipleImages([
      'SarahFrick007', 'AnnaWirth07', 'JuliaEder009', 'Boudoir0021',
    ]),
  },
});
