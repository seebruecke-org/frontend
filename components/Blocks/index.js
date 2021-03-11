import { blockNameMatches } from '@/lib/blocks';

import {
  default as Accordion,
  FRAGMENT as ACCORDION_FRAGMENT
} from './Accordion';
import {
  default as Actions,
  FRAGMENT as ACTIONS_FRAGMENT,
  sideloadData as actionsSideloadData
} from './Actions';
import { default as Contact, FRAGMENT as CONTACT_FRAGMENT } from './Contact';
import { default as Heading, FRAGMENT as HEADING_FRAGMENT } from './Heading';
import { default as Material, FRAGMENT as MATERIAL_FRAGMENT } from './Material';
import { default as Media, FRAGMENT as MEDIA_FRAGMENT } from './Media';
import {
  default as MediaGallery,
  FRAGMENT as MEDIA_GALLERY_FRAGMENT
} from './MediaGallery';
import {
  default as Newsletter,
  FRAGMENT as NEWSLETTER_FRAGMENT
} from './Newsletter';
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
  default as TeasersSmall,
  FRAGMENT as TEASERS_SMALL_FRAGMENT
} from './TeasersSmall';
import {
  default as Unterbrecher,
  FRAGMENT as UNTERBRECHER_FRAGMENT
} from './Unterbrecher';

const blocks = {
  Accordion: {
    Component: Accordion,
    FRAGMENT: ACCORDION_FRAGMENT
  },

  Actions: {
    Component: Actions,
    FRAGMENT: ACTIONS_FRAGMENT,
    sideloadData: actionsSideloadData
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

  MediaGallery: {
    Component: MediaGallery,
    FRAGMENT: MEDIA_GALLERY_FRAGMENT
  },

  Newsletter: {
    Component: Newsletter,
    FRAGMENT: NEWSLETTER_FRAGMENT
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

  TeasersSmall: {
    Component: TeasersSmall,
    FRAGMENT: TEASERS_SMALL_FRAGMENT
  },

  Unterbrecher: {
    Component: Unterbrecher,
    FRAGMENT: UNTERBRECHER_FRAGMENT
  }
};

function getFilteredBlocks(exclude = []) {
  return Object.keys(blocks).filter((blockName) => {
    const hasExludes = Array.isArray(exclude);

    if (hasExludes) {
      return !exclude.includes(blockName);
    }

    return true;
  });
}

export function getFragments(options = {}) {
  const { exclude } = options;
  const fragments = getFilteredBlocks(exclude).map((blockName) => {
    const { FRAGMENT } = blocks[blockName];

    return FRAGMENT;
  });

  return fragments;
}

export async function sideloadBlockData(content, key) {
  if (!content) {
    return content;
  }

  const blocksWithSideloadedData = await Promise.all(
    content[key].map(async (block) => {
      const blockName = Object.keys(blocks).find((currentBlockName) =>
        blockNameMatches(currentBlockName, block.__typename)
      );

      const sideloadFunc = blocks[blockName]?.sideloadData;
      let sideloadedData = '';

      if (sideloadFunc) {
        sideloadedData = await sideloadFunc(block);
      }

      return {
        ...block,
        ...sideloadedData
      };
    })
  );

  return {
    ...content,
    [key]: blocksWithSideloadedData
  };
}

export default blocks;
