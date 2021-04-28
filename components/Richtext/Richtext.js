import Markdown from '@/components/Markdown';

import Heading from '@/components/Blocks/Heading';
import Link from '@/components/Richtext/Link';
import List, { ListItem } from '@/components/Richtext/List';
import Paragraph from '@/components/Richtext/Paragraph';

export default function Richtext({ content, size = 'regular', ...props }) {
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
          <Paragraph size={size}>{children}</Paragraph>
        </ListItem>
      );
    },

    paragraph: ({ children }) => {
      return <Paragraph size={size}>{children}</Paragraph>;
    }
  };

  return (
    <Markdown renderers={RENDERERS} {...props}>
      {content}
    </Markdown>
  );
}
