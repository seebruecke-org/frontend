import { Accordion as ReactAccordion } from 'react-accessible-accordion';

export default function Accordion({ children, ...props }) {
  return <ReactAccordion {...props}>{children}</ReactAccordion>;
}
