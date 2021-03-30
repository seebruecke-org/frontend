import { block as accordion } from './Accordion';
import { block as actions } from './Actions';
import { block as contact } from './Contact';
import { block as fundraisingBox } from './Fundraisingbox';
import { block as heading } from './Heading';
import { block as material } from './Material';
import { block as media } from './Media';
import { block as gallery } from './MediaGallery';
import { block as newsletter } from './Newsletter';
import { block as richtext } from './Richtext';
import { block as stageMedium } from './StageMedium';
import { block as stageLarge } from './StageLarge';
import { block as subNavigation } from './SubNavigation';
import { block as teaserLarge } from './TeaserLarge';
import { block as teasersSmall } from './TeasersSmall';
import { block as unterbrecher } from './Unterbrecher';

import { blockNameMatches } from '@/lib/blocks';

const blocks = [
  accordion,
  actions,
  contact,
  fundraisingBox,
  heading,
  material,
  media,
  gallery,
  newsletter,
  richtext,
  stageMedium,
  stageLarge,
  subNavigation,
  teaserLarge,
  teasersSmall,
  unterbrecher
];

function getFilteredBlocks(exclude = []) {
  return blocks.filter(({ name }) => {
    const hasExludes = Array.isArray(exclude);

    if (hasExludes) {
      return !exclude.includes(name);
    }

    return true;
  });
}

export function getFragments(options = {}) {
  const { exclude } = options;

  return getFilteredBlocks(exclude).map(({ Fragment }) => Fragment);
}

export async function sideloadBlockData(content, key) {
  if (!content) {
    return content;
  }

  const blocksWithSideloadedData = await Promise.all(
    content[key].map(async (contentBlock) => {
      const { __typename } = contentBlock;
      const block = blocks.find(({ name }) =>
        blockNameMatches(name, __typename)
      );
      let sideloadedData = '';

      if (block?.sideload) {
        sideloadedData = await block.sideload(contentBlock);
      }

      return {
        ...contentBlock,
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
