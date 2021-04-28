import { urqlDecorator } from '@urql/storybook-addon';

import Richtext from './Richtext';

export default {
  title: 'Richtext',
  component: Richtext,
  decorator: [urqlDecorator]
};

export const Paragraph = () => (
  <Richtext
    content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`}
  />
);

Paragraph.storyName = 'Paragraph';

export const Bold = () => (
  <Richtext
    content={`Lorem **ipsum dolor sit** amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`}
  />
);

Bold.storyName = 'Bold';

export const Italic = () => (
  <Richtext
    content={`Lorem *ipsum dolor sit* amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.`}
  />
);

Italic.storyName = 'Italic';

export const Heading = () => (
  <Richtext
    content={`
## Headline 2

### Headline 3

#### Headline 4`}
  />
);

Heading.storyName = 'Headings';

export const HeadingsAndParagraphs = () => (
  <Richtext
    content={`
## Headline 2

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.

### Headline 3

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.

#### Headline 4

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.

`}
  />
);

HeadingsAndParagraphs.storyName = 'Headings & Paragraphs';

export const List = () => (
  <Richtext
    content={`

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.

- Item 1
- Item 2
- Item 3

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.

`}
  />
);

List.storyName = 'List';

export const Link = () => (
  <Richtext
    content={`Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut [Email schreiben](https://google.com) labore et dolore magna.`}
  />
);

Link.storyName = 'Link';
