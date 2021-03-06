import {
  Accordion,
  AccordionItem,
  AccordionPanel
} from '@/components/Accordion';
import Richtext from '../Richtext';

export default function AccordionBlock({ item = [] }) {
  return (
    <Accordion allowMultipleExpanded allowZeroExpanded>
      {item.map(({ title, content }, index) => (
        // eslint-disable-next-line react/jsx-key
        <AccordionItem
          isLast={index + 1 === item.length}
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
