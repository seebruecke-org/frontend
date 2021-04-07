import {
  AccordionItem as AccordionItemReact,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemState
} from 'react-accessible-accordion';
import clsx from 'clsx';

import MinusIcon from '@/public/icons/minus.svg';
import PlusIcon from '@/public/icons/plus.svg';
import React from 'react';

export default function AccordionItem({
  children,
  isLast,
  heading = null,
  activeBackground = true,
  iconClassName = 'w-10 md:w-12 h-10 md:h-12 flex-shrink-0 self-start ml-auto mt-1',
  ...props
}) {
  return (
    <AccordionItemReact>
      <AccordionItemHeading>
        <AccordionItemState>
          {({ expanded }) => (
            <AccordionItemButton
              className={clsx(
                'px-8 py-4 md:p-7 border-gray-400 border-t cursor-pointer font-rubik font-rubik-features text-base  md:text-medium lg:text-l font-bold flex items-center',
                { 'border-b': isLast },
                expanded && activeBackground
                  ? 'bg-orange-800 text-white border-b-0'
                  : 'hover:bg-gray-200'
              )}
              {...props}
            >
              {heading}

              {expanded ? (
                <MinusIcon className={iconClassName} />
              ) : (
                <PlusIcon className={iconClassName} />
              )}
            </AccordionItemButton>
          )}
        </AccordionItemState>
      </AccordionItemHeading>

      {children}
    </AccordionItemReact>
  );
}
