import Markdown from '@/components/Markdown';

import Link from './Link';
import Paragraph from './Paragraph';

const RENDERERS = {
  link: ({ node: { url }, children }) => {
    return <Link href={url}>{children}</Link>;
  },

  paragraph: ({ children }) => {
    return <Paragraph>{children}</Paragraph>;
  }
};

export default function Richtext({ richtext }) {
  return (
    <Markdown renderers={RENDERERS} className="col-start-2 col-span-9">
      {richtext}
    </Markdown>
  );
}
