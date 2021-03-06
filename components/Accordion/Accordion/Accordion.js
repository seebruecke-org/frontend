import { Accordion as ReactAccordion } from 'react-accessible-accordion';

export default function Accordion({ children, ...props }) {
  return (
    <ReactAccordion
      className="col-span-full md:col-start-3 md:col-span-9 py-20"
      {...props}
    >
      {children}
    </ReactAccordion>
  );
}
