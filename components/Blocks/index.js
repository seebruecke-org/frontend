import { default as Heading, FRAGMENT as HEADING_FRAGMENT } from './Heading';
import { default as Image, FRAGMENT as IMAGE_FRAGMENT, transform as transformImageAttributes } from './Image';
import { default as Paragraph, FRAGMENT as PARAGRAPH_FRAGMENT } from './Paragraph';

const blocks = {
  CoreHeadingBlock: {
    Component: Heading,
    FRAGMENT: HEADING_FRAGMENT
  },

  CoreImageBlock: {
    Component: Image,
    FRAGMENT: IMAGE_FRAGMENT,
    transform: transformImageAttributes
  },

  CoreParagraphBlock: {
    Component: Paragraph,
    FRAGMENT: PARAGRAPH_FRAGMENT
  },
};

export function getFragments() {
  return Object.keys(blocks).map(blockName => {
    const { FRAGMENT } = blocks[blockName];

    return FRAGMENT;
  })
}

export default blocks;
