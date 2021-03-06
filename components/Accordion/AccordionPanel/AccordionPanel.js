import { AccordionItemPanel } from 'react-accessible-accordion';

export default function AccordionPanel({ children, ...props }) {
  return <AccordionItemPanel {...props}>{children}</AccordionItemPanel>;
}
