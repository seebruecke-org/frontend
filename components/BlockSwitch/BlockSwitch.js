import gutenbergBlocks from '@/components/Blocks';
import VStack from '@/components/VStack';

const blocksWithMargin = ['CoreParagraphBlock', 'CoreHeadingBlock'];

export default function BlockSwitch({ blocks }) {
  const blockMap = Object.keys(gutenbergBlocks).reduce((acc, blockName) => {
    acc[blockName] = gutenbergBlocks[blockName].Component;

    return acc;
  }, {});

  const firstBlock = blocks && blocks.length > 0 && blocks[0].__typename;
  const lastBlock =
    blocks && blocks.length > 0 && blocks[blocks.length - 1].__typename;
  const addMarginBottom = lastBlock && blocksWithMargin.includes(lastBlock);
  const addMarginTop = firstBlock && blocksWithMargin.includes(firstBlock);

  return (
    <div
      className={`flex justify-center ${addMarginTop && 'mt-10 md:mt-20'} ${
        addMarginBottom && 'pb-20 md:pb-60'
      }`}
    >
      <VStack gap={10} className="grid grid-cols-12 max-w-wide w-full">
        {blocks.map(({ __typename: type, ...props }, index) => {
          const BlockComponent = blockMap[type] || null;

          if (!BlockComponent) {
            return (
              <code
                key={`block-not-${index}`}
                className="col-start-2 col-span-9"
              >
                The block &quot;{type}&quot; isn&apos;t implemented yet.
              </code>
            );
          }

          return <BlockComponent key={`block-${type}-${index}`} {...props} />;
        })}
      </VStack>
    </div>
  );
}
