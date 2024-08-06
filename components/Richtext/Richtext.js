import Markdown from '@/components/Markdown'

import Heading from '@/components/Blocks/Heading'
import Link from './Link'
import List, { ListItem } from './List'
import Paragraph from './Paragraph'

export default function Richtext({
  content,
  size = 'regular',
  scrollMargin,
  renderers,
  ...props
}) {
  const components = {
    // eslint-disable-next-line react/display-name
    heading: ({ level, children }) => {
      return (
        <Heading level={level - 1} scrollMargin={scrollMargin}>
          {children}
        </Heading>
      )
    },

    // eslint-disable-next-line react/display-name
    link: ({ node: { url }, children }) => {
      return <Link href={url}>{children}</Link>
    },

    // eslint-disable-next-line react/display-name
    list: ({ ordered, children }) => {
      return <List ordered={ordered}>{children}</List>
    },

    // eslint-disable-next-line react/display-name
    listItem: ({ children }) => {
      return (
        <ListItem>
          <Paragraph size={size}>{children}</Paragraph>
        </ListItem>
      )
    },

    // eslint-disable-next-line react/display-name
    paragraph: ({ children }) => {
      // Don't wrap images in paragraph tags
      if (children && children.length === 1 && children?.[0]?.props?.src) {
        return children
      }

      return <Paragraph size={size}>{children}</Paragraph>
    },

    ...renderers
  }

  return (
    <Markdown components={components} {...props}>
      {content}
    </Markdown>
  )
}
