import accordion from './Accordion/block';
import actions from './Actions/block';
import contact from './Contact/block';
import fundraisingBox from './Fundraisingbox/block';
import embed from './Embed/block';
import heading from './Heading/block';
import material from './Material/block';
import media from './Media/block';
import gallery from './MediaGallery/block';
import newsletter from './Newsletter/block';
import richtext from './Richtext/block';
import stageMedium from './StageMedium/block';
import stageLarge from './StageLarge/block';
import subNavigation from './SubNavigation/block';
import teaserLarge from './TeaserLarge/block';
import teasersSmall from './TeasersSmall/block';
import unterbrecher from './Unterbrecher/block';

import { blockNameMatches } from '@/lib/blocks';

const blocks = [
  accordion,
  actions,
  contact,
  fundraisingBox,
  embed,
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
    const hasExcludes = Array.isArray(exclude);

    if (hasExcludes) {
      return !exclude.includes(name);
    }

    return true;
  });
}

export function getFragments(options = {}) {
  const { exclude } = options;

  return getFilteredBlocks(exclude).map(({ Fragment }) => Fragment);
}

export async function sideloadBlockData(
  content,
  key,
  formatting,
  options,
  locale
) {
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
        sideloadedData = await block.sideload(
          contentBlock,
          formatting,
          options,
          locale
        );
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
