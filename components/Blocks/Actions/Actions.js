import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import Action from '@/components/Teaser/Action';
import CTA from '@/components/CTA';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'));

import * as styles from './actions.module.css';

export default function ActionsBlock({ show_map = false, cta, actions = [] }) {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    triggerOnce: true
  });

  if (actions.length === 0) {
    return null;
  }

  return (
    <section
      className="col-span-full md:col-start-2 md:col-span-12 pt-10 md:pt-12 pb-20 md:pb-32"
      ref={ref}
    >
      {show_map && (
        <div
          className={clsx(
            'bg-gray-500 mb-8 overflow-hidden',
            styles.mapContainer
          )}
        >
          {inView && <MapboxMap factory={{ scrollZoom: false }} />}
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {actions.map(({ location, start, intro, title, slug }, index) => (
          <li key={`action-${index}`}>
            <Action
              title={location}
              meta={`${format(
                new Date(start),
                `${t('action.dateFormat')}, ${t('action.timeFormat')}`
              )} ${t('action.timePostfix')}`}
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
