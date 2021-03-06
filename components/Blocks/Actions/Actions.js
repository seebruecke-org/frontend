import dynamic from 'next/dynamic';

import Action from '@/components/Teaser/Action';
import CTA from '@/components/CTA';

const ACTIONS = [
  {
    title: 'Villingen',
    meta: '17. Mar 2021, 12:00 Uhr',
    intro: 'NO MORE MORIA - Demo und Küfa',
    slug: 'whatever'
  },

  {
    title: 'Berlin',
    meta: '17. Apr 2021, 12:00 Uhr',
    intro: 'Ein Jahr nach Hanau! Rassismus tötet überall!',
    slug: 'whatever'
  },

  {
    title: 'Brandenburg an der Havel',
    meta: '17. Apr 2021',
    intro:
      'No Border, No Nation, Stop Deportation – Offenes Gruppentreffen von “No Lager”',
    slug: 'whatever'
  },

  {
    title: 'Aachen',
    meta: '13. May 2021, 12:00 Uhr - 12:00 Uhr',
    intro:
      'Menschenrechte an den Außengrenzen der Europäischen Union – Anspruch und Wirklichkeit',
    slug: 'whatever'
  },

  {
    title: 'Online',
    meta: '10. Feb 2021',
    intro:
      'Über uns 27.02.2021 um 18:00 in Online Live Event: Aufnahme statt Abschottung. Ein Perspektivwechsel',
    slug: 'whatever'
  }
];

export default function ActionsBlock({ max_actions_to_show, show_map, cta }) {
  const MapboxMap = dynamic(() => import('@/components/MapboxMap'));

  return (
    <section className="col-span-full md:col-start-2 md:col-span-12 mt-10 md:mt-12 mb-20 md:mb-32">
      {show_map && <MapboxMap className="mb-8 h-96" />}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {ACTIONS.map((action, index) => (
          <li key={`action-${index}`}>
            <Action {...action} />
          </li>
        ))}
      </ul>

      {cta && (
        <div className="flex justify-center mt-16">
          <CTA inverse {...cta} />
        </div>
      )}
    </section>
  );
}
