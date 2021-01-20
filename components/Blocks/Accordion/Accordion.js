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
      className="col-start-3 col-span-9 py-20"
      allowMultipleExpanded
      allowZeroExpanded
    >
      {item.map(({ title, content }, index) => {
        const isLast = index + 1 === item.length;

        return (
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton
                className={`p-6 border-black border-t ${
                  isLast && 'border-b'
                } hover:bg-gray-200 cursor-pointer font-rubik text-medium md:text-l font-bold flex items-center`}
              >
                <span>{title}</span>

                <PlusIcon className="w-8 h-8 flex-shrink-0 ml-auto" />
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="border-black border-t py-10 px-6">
                <Richtext richtext={content} />
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
