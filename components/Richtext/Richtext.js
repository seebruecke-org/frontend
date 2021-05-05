import Markdown from '@/components/Markdown';

import Heading from '@/components/Blocks/Heading';
import Image from './Image';
import Link from './Link';
import List, { ListItem } from './List';
import Paragraph from './Paragraph';

export default function Richtext({
  content,
  size = 'regular',
  scrollMargin,
  renderers,
  ...props
}) {
  const RENDERERS = {
    heading: ({ level, children }) => {
      return (
        <Heading level={level - 1} scrollMargin={scrollMargin}>
          {children}
        </Heading>
      );
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
      // Don't wrap images in paragraph tags
      if (children && children.length === 1 && children?.[0]?.props?.src) {
        return children;
      }

      return <Paragraph size={size}>{children}</Paragraph>;
    },

    ...renderers
  };

  return (
    <Markdown renderers={RENDERERS} {...props}>
      {content}
    </Markdown>
  );
}
