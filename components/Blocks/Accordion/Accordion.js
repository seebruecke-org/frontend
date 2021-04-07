import {
  Accordion,
  AccordionItem,
  AccordionPanel
} from '@/components/Accordion';
import Richtext from '../Richtext';

export default function AccordionBlock({ items = [] }) {
  return (
    <Accordion
      allowMultipleExpanded
      allowZeroExpanded
      className="col-span-full md:col-start-3 md:col-span-9 py-20"
    >
      {items.map(({ title, content }, index) => (
        // eslint-disable-next-line react/jsx-key
        <AccordionItem
          isLast={index + 1 === items.length}
          heading={<span>{title}</span>}
        >
          <AccordionPanel>
            <div className="py-6 md:py-10 md:px-6">
              <Richtext richtext={content} />
            </div>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
