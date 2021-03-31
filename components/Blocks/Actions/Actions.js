import { useI18n } from 'next-localization';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

import Action from '@/components/Teaser/Action';
import CTA from '@/components/CTA';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'));

export default function ActionsBlock({ show_map = false, cta, actions = [] }) {
  const i18n = useI18n();

  return (
    <section className="col-span-full md:col-start-2 md:col-span-12 mt-10 md:mt-12 mb-20 md:mb-32">
      {show_map && <MapboxMap className="mb-8 h-96" />}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {actions.map(({ location, start, intro, title, slug }, index) => (
          <li key={`action-${index}`}>
            <Action
              title={location}
              meta={`${format(
                new Date(start),
                `${i18n.t('action.dateFormat')}, ${i18n.t('action.timeFormat')}`
              )} ${i18n.t('action.timePostfix')}`}
              intro={intro || title}
              slug={slug}
            />
          </li>
        ))}
      </ul>

      {cta && (
        <div className="flex justify-center mt-16">
          <CTA inverse link={cta} />
        </div>
      )}
    </section>
  );
}
