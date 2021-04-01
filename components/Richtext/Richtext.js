import Markdown from '@/components/Markdown';

import Heading from '@/components/Blocks/Heading';
import Link from './Link';
import List, { ListItem } from './List';
import Paragraph from './Paragraph';

export default function Richtext({ content, isSmall = false, ...props }) {
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

  return (
    <Markdown renderers={RENDERERS} {...props}>
      {content}
    </Markdown>
  );
}
