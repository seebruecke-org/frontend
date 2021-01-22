import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion';

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
              <AccordionItemButton
                className={`px-10 py-4 md:p-6 border-black border-t ${
                  isLast && 'border-b'
                } hover:bg-gray-200 cursor-pointer font-rubik text-base  md:text-medium lg:text-l font-bold flex items-center`}
              >
                <span>{title}</span>

                <PlusIcon className="w-8 h-8 flex-shrink-0 ml-auto" />
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="border-black border-t py-6 md:py-10 px-10 md:px-6">
                <Richtext richtext={content} />
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
