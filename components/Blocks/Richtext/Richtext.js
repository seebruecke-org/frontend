import Markdown from '@/components/Markdown';

import Heading from '../Heading';
import Link from './Link';
import List, { ListItem } from './List';
import Paragraph from './Paragraph';

import { blockNameMatches } from '@/lib/blocks';

export default function Richtext({
  richtext,
  blockContext = {},
  isSmall = false
}) {
  const { previous } = blockContext;
  let marginTop = 'mt-5 md:mt-10';

  const RENDERERS = {
    heading: ({ level, children }) => {
      return <Heading level={level - 1}>{children}</Heading>;
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
          <Paragraph isSmall={isSmall}>{children}</Paragraph>
        </ListItem>
      );
    },

    paragraph: ({ children }) => {
      return <Paragraph isSmall={isSmall}>{children}</Paragraph>;
    }
  };

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
