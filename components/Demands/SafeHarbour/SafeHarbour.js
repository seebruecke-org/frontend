import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState
} from 'react-accessible-accordion';
import { useI18n } from 'next-localization';

import ChevronDownIcon from '@/public/icons/chevron-down-light.svg';
import ChevronUpIcon from '@/public/icons/chevron-up-light.svg';
import MinusIcon from '@/public/icons/minus.svg';
import PlusIcon from '@/public/icons/plus.svg';
import Richtext from '@/components/Blocks/Richtext';

export default function SafeHarbourDemands({ demands }) {
  const i18n = useI18n();

  return (
    <Accordion
      className="col-span-full md:col-start-3 md:col-span-9 my-12"
      allowMultipleExpanded
      allowZeroExpanded
    >
      {Object.keys(demands).map((demandKey, demandIndex) => {
        const isLast = demandIndex + 1 == Object.keys(demands).length;
        const demand = demands[demandKey];
        let color = 'bg-gray-500';

        if (demand === true) {
          color = 'bg-turquoise-300';
        }

        if (demand === false) {
          color = 'bg-orange-900';
        }

        return (
          // eslint-disable-next-line react/jsx-key
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemState>
                {({ expanded }) => (
                  <AccordionItemButton
                    className={`pl-4 pr-4 md:px-8 py-8 md:p-7 border-gray-400 border-t ${
                      isLast && 'border-b'
                    } cursor-pointer flex`}
                  >
                    <span
                      className={`${color} w-14 h-14 md:w-16 md:h-16 flex rounded-full text-white flex-shrink-0 items-center justify-center font-rubik font-rubik-features text-base md:text-medium font-bold`}
                    >
                      {demandIndex + 1}
                    </span>
                    <div className="ml-4 md:ml-8">
                      <span className="font-rubik font-rubik-features text-base md:text-large font-bold leading-tight">
                        {i18n.t(`safeHarbour.demands.${demandKey}.title`)}
                      </span>
                      <span className="block font-rubik text-xs mt-2">
                        {i18n.t('safeHarbour.demand.decided')} &amp;{' '}
                        {i18n.t('safeHarbour.demand.fullfilled')}
                      </span>

                      <span className="flex font-rubik text-2xs md:hidden text-gray-600 mt-6 items-center">
                        {i18n.t(
                          `safeHarbour.demand.${
                            expanded ? 'readLess' : 'readMore'
                          }`
                        )}

                        {expanded ? (
                          <ChevronUpIcon className="w-4 h-auto ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-auto ml-2" />
                        )}
                      </span>
                    </div>
                    {expanded ? (
                      <MinusIcon className="w-8 h-8 flex-shrink-0 ml-auto hidden md:flex" />
                    ) : (
                      <PlusIcon className="w-8 h-8 flex-shrink-0 ml-auto hidden md:flex" />
                    )}
                  </AccordionItemButton>
                )}
              </AccordionItemState>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="pl-14 md:pl-32 pb-8 md:pb-10">
                <Richtext
                  richtext={i18n.t(
                    `safeHarbour.demands.${demandKey}.description`
                  )}
                />
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
