import { useTranslation } from 'next-i18next';
import { AccordionItemState } from 'react-accessible-accordion';
import format from 'date-fns/format';

import {
  Accordion,
  AccordionItem,
  AccordionPanel
} from '@/components/Accordion';
import ChevronDownIcon from '@/public/icons/chevron-down-light.svg';
import ChevronUpIcon from '@/public/icons/chevron-up-light.svg';
import CTA from '@/components/CTA';
import Richtext from '@/components/Richtext';

import * as styles from './safeHarbour.module.css';

const KEYS = [
  'public_solidarity_declaration',
  'supports_searescue_actively',
  'admission_in_addition_quota',
  'admission_program',
  'communal_reception',
  'national_international_networking',
  'alliance_safe_harbours',
  'transparency'
];

function Heading({ index, decided = false, fullfilled = false, demand }) {
  const { t } = useTranslation();
  let color = 'bg-gray-500';

  if (decided === false && fullfilled === false) {
    color = 'bg-orange-900';
  } else if (decided === true && fullfilled === true) {
    color = styles.demandFullfilled;
  }

  return (
    <div className="flex py-3">
      <span
        className={`${color} w-14 h-14 md:w-16 md:h-16 flex rounded-full text-white flex-shrink-0 items-center justify-center font-rubik font-rubik-features text-base md:text-medium font-bold self-start -ml-4 leading-none`}
      >
        {index + 1}
      </span>
      <div className="ml-4 md:ml-8">
        <span className="font-rubik font-rubik-features text-base md:text-large font-bold leading-tight">
          {t(`safeHarbour.demands.${demand}.title`)}
        </span>
        <span className="block font-rubik font-normal text-xs mt-2">
          {decided === false && `${t('safeHarbour.demand.not')} `}
          {decided === null && `${t('safeHarbour.demand.unknown')} `}
          {t('safeHarbour.demand.decided')} &middot;{' '}
          {fullfilled === false && `${t('safeHarbour.demand.not')} `}
          {fullfilled === null && `${t('safeHarbour.demand.unknown')} `}
          {t('safeHarbour.demand.fullfilled')}
        </span>

        <AccordionItemState>
          {({ expanded }) => (
            <span className="flex font-rubik text-2xs font-normal md:hidden mt-6 items-center text-gray-600">
              {t(`safeHarbour.demand.${expanded ? 'readLess' : 'readMore'}`)}

              {expanded ? (
                <ChevronUpIcon className="w-4 h-auto ml-2" />
              ) : (
                <ChevronDownIcon className="w-4 h-auto ml-2" />
              )}
            </span>
          )}
        </AccordionItemState>
      </div>
    </div>
  );
}

export default function SafeHarbourDemands({
  cityName,
  federalCountryName = '',
  demands: { last_updated, cta, ...demands }
}) {
  const { t } = useTranslation();

  return (
    <div className="col-span-full md:col-start-3 md:col-span-9 my-12">
      {last_updated && (
        <p className="font-rubik text-small md:text-base mb-16 px-8 md:px-0">
          {t('safeHarbour.lastUpdated')}{' '}
          {format(new Date(last_updated), t('safeHarbour.dateFormat'))}
        </p>
      )}

      <Accordion allowMultipleExpanded allowZeroExpanded>
        {KEYS.map((demandKey, demandIndex) => {
          let description = t(`safeHarbour.demands.${demandKey}.description`, {
            city: cityName,
            federal_country: federalCountryName
          });

          return (
            // eslint-disable-next-line react/jsx-key
            <AccordionItem
              isLast={demandIndex + 1 == KEYS.lengthLast}
              activeBackground={false}
              iconClassName="w-14 h-14 flex-shrink-0 self-start ml-auto mt-3 hidden md:flex"
              heading={
                <Heading
                  index={demandIndex}
                  decided={demands[`${demandKey}_decided`]}
                  fullfilled={demands[`${demandKey}_fullfilled`]}
                  demand={demandKey}
                />
              }
            >
              <AccordionPanel>
                <div className="pl-14 md:pl-28 pb-8 md:pb-10">
                  <Richtext content={description} size="small" />
                </div>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>

      <p className="font-rubik text-base text-gray-600 mt-12 px-8 md:px-0">
        {t('safeHarbour.disclaimer')}
      </p>

      {cta && (
        <div className="flex justify-center mt-10 md:mt-16">
          <CTA link={cta} inverse />
        </div>
      )}
    </div>
  );
}
