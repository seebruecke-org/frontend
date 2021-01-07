import * as gutenbergBlocks from '@/components/Blocks';
import VStack from '@/components/VStack';

const firstBlocksWithMargin = [
  'CoreParagraphBlock',
  'CoreHeadingBlock'
];

export default function BlockSwitch({ blocks }) {
  const blockMap = Object.keys(gutenbergBlocks).reduce((acc, blockName) => {
    if (!blockName.endsWith('FRAGMENT')) {
      acc[`Core${blockName}Block`] = gutenbergBlocks[blockName];
    }

    return acc;
  }, {});

  const firstBlock = blocks && blocks.length > 0 && blocks[0].__typename;
  const addMarginTop = firstBlock && firstBlocksWithMargin.includes(firstBlock);

  return <div className={`flex justify-center ${addMarginTop && "mt-10 md:mt-20 mb-20 md:mb-40"}`}>
    <VStack gap={10} className="grid max-w-regular w-full">
    {blocks.map(({ __typename: type, ...props }) => {
      const BlockComponent = blockMap[type] || null;

      if (!BlockComponent) {
        return <code>
          The block "{type}" isn't implemented yet.
        </code>;
      }

      return <BlockComponent {...props} />
    })}
  </VStack>
  </div>
}
