import Markdown from '@/components/Markdown';

import Heading from '../Heading';
import Link from './Link';
import List, { ListItem } from './List';
import Paragraph from './Paragraph';

import { blockNameMatches } from '@/lib/blocks';

const RENDERERS = {
  heading: ({ level, children }) => {
    return <Heading level={level}>{children}</Heading>;
  },

  link: ({ node: { url }, children }) => {
    return <Link href={url}>{children}</Link>;
  },

  list: ({ ordered, children }) => {
    return <List ordered={ordered}>{children}</List>;
  },

  listItem: ({ children }) => {
    return (
      <ListItem>
        <Paragraph>{children}</Paragraph>
      </ListItem>
    );
  },

  paragraph: ({ children }) => {
    return <Paragraph>{children}</Paragraph>;
  }
};

export default function Richtext({ richtext, blockContext = {} }) {
  const { previous } = blockContext;
  let marginTop = 'mt-5 md:mt-10';

  if (blockNameMatches(previous, 'SubNavigation')) {
    marginTop = 'mt-12 md:mt-20';
  }

  return (
    <Markdown
      renderers={RENDERERS}
      className={`col-span-full md:col-start-3 md:col-span-9 flex flex-col space-y-10 ${marginTop} mb-5 md:mb-10`}
    >
      {richtext}
    </Markdown>
  );
}
