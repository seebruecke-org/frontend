import { default as Heading, FRAGMENT as HEADING_FRAGMENT } from './Heading';
import { default as Image, FRAGMENT as IMAGE_FRAGMENT } from './Image';
import { default as Richtext, FRAGMENT as RICHTEXT_FRAGMENT } from './Richtext';
import {
  default as StageMedium,
  FRAGMENT as STAGE_MEDIUM_FRAGMENT
} from './StageMedium';

const blocks = {
  Heading: {
    Component: Heading,
    FRAGMENT: HEADING_FRAGMENT
  },

  Image: {
    Component: Image,
    FRAGMENT: IMAGE_FRAGMENT
  },

  Richtext: {
    Component: Richtext,
    FRAGMENT: RICHTEXT_FRAGMENT
  },

  StageMedium: {
    Component: StageMedium,
    FRAGMENT: STAGE_MEDIUM_FRAGMENT
  }
};

export function getFragments() {
  return Object.keys(blocks).map((blockName) => {
    const { FRAGMENT } = blocks[blockName];

    return FRAGMENT;
  });
}

export default blocks;
