import {
  default as Accordion,
  FRAGMENT as ACCORDION_FRAGMENT
} from './Accordion';
import { default as Contact, FRAGMENT as CONTACT_FRAGMENT } from './Contact';
import { default as Heading, FRAGMENT as HEADING_FRAGMENT } from './Heading';
import { default as Material, FRAGMENT as MATERIAL_FRAGMENT } from './Material';
import { default as Media, FRAGMENT as MEDIA_FRAGMENT } from './Media';
import { default as Richtext, FRAGMENT as RICHTEXT_FRAGMENT } from './Richtext';
import {
  default as StageMedium,
  FRAGMENT as STAGE_MEDIUM_FRAGMENT
} from './StageMedium';
import {
  default as StageLarge,
  FRAGMENT as STAGE_LARGE_FRAGMENT
} from './StageLarge';
import {
  default as SubNavigation,
  FRAGMENT as SUB_NAVIGATION_FRAGMENT
} from './SubNavigation';
import {
  default as TeaserLarge,
  FRAGMENT as TEASER_LARGE_FRAGMENT
} from './TeaserLarge';
import {
  default as Unterbrecher,
  FRAGMENT as UNTERBRECHER_FRAGMENT
} from './Unterbrecher';

const blocks = {
  Accordion: {
    Component: Accordion,
    FRAGMENT: ACCORDION_FRAGMENT
  },

  Contact: {
    Component: Contact,
    FRAGMENT: CONTACT_FRAGMENT
  },

  Heading: {
    Component: Heading,
    FRAGMENT: HEADING_FRAGMENT
  },

  Material: {
    Component: Material,
    FRAGMENT: MATERIAL_FRAGMENT
  },

  Media: {
    Component: Media,
    FRAGMENT: MEDIA_FRAGMENT
  },

  Richtext: {
    Component: Richtext,
    FRAGMENT: RICHTEXT_FRAGMENT
  },

  StageMedium: {
    Component: StageMedium,
    FRAGMENT: STAGE_MEDIUM_FRAGMENT
  },

  StageLarge: {
    Component: StageLarge,
    FRAGMENT: STAGE_LARGE_FRAGMENT
  },

  SubNavigation: {
    Component: SubNavigation,
    FRAGMENT: SUB_NAVIGATION_FRAGMENT
  },

  TeaserLarge: {
    Component: TeaserLarge,
    FRAGMENT: TEASER_LARGE_FRAGMENT
  },

  Unterbrecher: {
    Component: Unterbrecher,
    FRAGMENT: UNTERBRECHER_FRAGMENT
  }
};

export function getFragments(options = {}) {
  const { exclude } = options;
  const fragments = Object.keys(blocks)
    .filter((blockName) => {
      const hasExludes = Array.isArray(exclude);

      if (hasExludes) {
        return !exclude.includes(blockName);
      }

      return true;
    })
    .map((blockName) => {
      const { FRAGMENT } = blocks[blockName];

      return FRAGMENT;
    });

  return fragments;
}

export default blocks;
