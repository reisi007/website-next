import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReisishotIcon, ReisishotIcons, ReisishotIconSizes } from '../utils/ReisishotIcons';

export function Footer() {
  const router = useRouter();
  return (
    <footer>
      <div className="mt-4 flex w-full justify-around">
        <a href="https://www.facebook.com/reisishot">
          <ReisishotIcon icon={ReisishotIcons.Facebook} size={ReisishotIconSizes.LARGE} />
        </a>
        <a href="https://www.instagram.com/florian.reisinger.photography/">
          <ReisishotIcon icon={ReisishotIcons.Instagram} size={ReisishotIconSizes.LARGE} />
        </a>
        <a href="https://wa.me/436702017710">
          <ReisishotIcon icon={ReisishotIcons.Whatsapp} size={ReisishotIconSizes.LARGE} />
        </a>
        <a href="https://m.me/reisishot/">
          <ReisishotIcon icon={ReisishotIcons.Messenger} size={ReisishotIconSizes.LARGE} />
        </a>
        <a href="mailto:florian@reisinger.pictures">
          <ReisishotIcon icon={ReisishotIcons.Mail} size={ReisishotIconSizes.LARGE} />
        </a>
      </div>
      {router.pathname !== '/impressum' && <Link className="block py-2 text-center" href="/impressum">Impressum & Datenschutz</Link>}
    </footer>
  );
}
