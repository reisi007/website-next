import { Header } from './Header';
import { Footer } from './images-next/page/Footer';

export function Page({
  children,
  title,
}: { children: JSX.Element, title: string }) {
  return (
    <>
      <Header title={title} />
      <div className="xxl:w-[1320px] mx-auto w-full sm:w-[540px] md:w-[720px] lg:w-[960px] xl:w-[1140px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
