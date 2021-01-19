import Markdown from '@/components/Markdown';

import Heading from '@/components/Heading';
import Link from './Link';
import Paragraph from './Paragraph';

const RENDERERS = {
  heading: ({ level, children }) => {
    return <Heading level={level}>{children}</Heading>;
  },

  link: ({ node: { url }, children }) => {
    return <Link href={url}>{children}</Link>;
  },

  paragraph: ({ children }) => {
    return <Paragraph>{children}</Paragraph>;
  }
};

export default function Richtext({ richtext }) {
  return (
    <Markdown
      renderers={RENDERERS}
      className="col-span-full md:col-start-3 md:col-span-9 flex flex-col space-y-10"
    >
      {richtext}
    </Markdown>
  );
}
