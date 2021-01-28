import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState
} from 'react-accessible-accordion';

import MinusIcon from '@/public/icons/minus.svg';
import PlusIcon from '@/public/icons/plus.svg';
import Richtext from '../Richtext';

export default function AccordionBlock({ item = [] }) {
  return (
    <Accordion
      className="col-span-full md:col-start-3 md:col-span-9 py-20"
      allowMultipleExpanded
      allowZeroExpanded
    >
      {item.map(({ title, content }, index) => {
        const isLast = index + 1 === item.length;

        return (
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemState>
                {({ expanded }) => (
                  <AccordionItemButton
                    className={`px-10 py-4 md:p-7 border-black border-t ${
                      isLast && 'border-b'
                    } ${expanded ? 'bg-orange-800' : 'hover:bg-gray-200'} cursor-pointer font-rubik font-rubik-features text-base  md:text-medium lg:text-l font-bold flex items-center`}
                  >
                    <span>{title}</span>

                    {expanded ? (
                      <MinusIcon className="w-8 h-8 flex-shrink-0 ml-auto" />
                    ) : (
                      <PlusIcon className="w-8 h-8 flex-shrink-0 ml-auto" />
                    )}
                  </AccordionItemButton>
                )}
              </AccordionItemState>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="border-black border-t py-6 md:py-10 md:px-6">
                <Richtext richtext={content} />
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
