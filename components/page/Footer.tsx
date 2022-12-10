import React from 'react';
import { ReisishotIcon, ReisishotIcons, ReisishotIconSizes } from '../utils/ReisishotIcons';

export function Footer() {
  return (
    <footer className="mt-4 flex w-full justify-around">
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
    </footer>
  );
}
