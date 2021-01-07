import Link from 'next/link';
import React from 'react';

import Grid from '@/components/Grid';
import HStack from '@/components/HStack';
import Logo from '@/components/Logo';
import MenuItem from '@/components/MenuItem';
import VStack from '@/components/VStack';

import { useStore } from '@/lib/store';

function Menu({ name, items }) {
  return <VStack as="div" gap={10}>
    <h4 className="uppercase font-bold">{name}</h4>

    {items?.nodes?.length > 0 && (
      <VStack as="ul" gap={5}>
        {items.nodes.map(node => (
          <li>
            <MenuItem {...node} />
          </li>
        ))}
      </VStack>
    )}
  </VStack>
}

export default function Footer() {
  const { menus: { footerTakePart, footerAbout, footerMeta } } = useStore();

  return <footer className="flex justify-center justify-self-end mt-auto bg-gray-700 text-white py-20">
    <Grid className="max-w-wide w-full">
      <div className="col-start-1 col-span-3">
        <Link href="/en/" locale="en">
          <a className="font-bold">
            English Version
          </a>
        </Link>
      </div>

      <div className="col-start-4 col-span-3">
        <Menu {...footerTakePart} />
      </div>

      <div className="col-start-7 col-span-3">
        <Menu {...footerAbout} />
      </div>

      <div className="col-start-10 col-span-3">
        <VStack gap={5}>
          <Logo />

          <p>Die SEEBRÜCKE ist eine internationale Bewegung, die sich für sichere Fluchtwege, für ungehinderte Seenotrettung und für ein Ende des Sterbens an den europäischen Grenzen engagiert.</p>
        </VStack>
      </div>

      {footerMeta?.items?.nodes && (
        <div className="flex justify-between col-start-1 col-span-12">
          <HStack as="nav" gap={5}>
            {footerMeta.items.nodes.map(node => (
              <MenuItem {...node} />
            ))}
          </HStack>

          [SOCIAL MEDIA ITEMS]
        </div>
      )}
    </Grid>
  </footer>
}
