import { GetStaticProps, InferGetStaticPropsType } from 'next';
import {
  EmpP, Page, MultipleBeforeAfterImages, ImageInfo, readMultipleImages,
} from '@reisisoft/images-next';

export default function Edit(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page title="Wie bearbeite ich Bilder">
      <EmpP>
        Bearbeitung von Bildern ist ein wichtiger Teil des fotografischen Prozesses. Darum teile ich nur
        {'" '}
        fertige
        {' "'}
        Bilder - also bearbeitete Bilder - mit der Außenwelt.
        Diese Seite ist die lebende Ausnahme, denn ich möchte dir hier ein Gefühl dafür geben, wie ich Bilder bearbeite.
      </EmpP>
      <p>Da es mir wichtig ist deine natürliche Schönheit einzufangen werde ich deinen Körper in keiner Weise verformen, temporäre Verletzungen (blauer Fleck / Pickel) aber entfernen.</p>
      <MultipleBeforeAfterImages data={props} />
    </Page>
  );
}

const IMAGES = [
  'AnnaWirth08',
  'Boudoir0004',
  'Boudoir0012',
  'Boudoir0021',
  'Boudoir0023',
  'EvaMair006',
  'Eva-und-Kevin008',
  'Frau08',
] as const;
type ImageNames = typeof IMAGES[number];
export const getStaticProps: GetStaticProps<Record<ImageNames, ImageInfo>> = async () => ({
  props: await readMultipleImages([...IMAGES]),
});
