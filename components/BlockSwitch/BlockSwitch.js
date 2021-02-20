import contentBlocks from '@/components/Blocks';

const blocksWithOuterMargin = [
  'ComponentSharedBlocksHeading',
  'ComponentSharedBlocksRichtext',
  'ComponentSharedBlocksAccordion'
];

export default function BlockSwitch({
  blocks,
  prefix = 'ComponentSharedBlocks',
  className
}) {
  if (!blocks) {
    return null;
  }

  const blockMap = Object.keys(contentBlocks).reduce((acc, blockName) => {
    acc[`${prefix}${blockName}`] = contentBlocks[blockName].Component;

    return acc;
  }, {});

  const firstBlock = blocks && blocks.length > 0 && blocks[0].__typename;
  const lastBlock =
    blocks && blocks.length > 0 && blocks[blocks.length - 1].__typename;
  const addMarginBottom =
    lastBlock && blocksWithOuterMargin.includes(lastBlock);
  const addMarginTop = firstBlock && blocksWithOuterMargin.includes(firstBlock);

  return (
    <div
      className={`grid grid-layout-primary ${
        addMarginTop && 'mt-10 md:mt-20'
      } ${addMarginBottom && 'pb-20 md:pb-60'} ${className}`}
    >
      {blocks.map(({ __typename: type, ...props }, index) => {
        const BlockComponent = blockMap[type] || null;

        if (!BlockComponent) {
          return (
            <code
              key={`block-not-${index}`}
              className="col-start-2 col-span-10"
            >
              The block &quot;{type}&quot; isn&apos;t implemented yet.
            </code>
          );
        }

        return (
          <BlockComponent
            key={`block-${type}-${index}`}
            blockContext={{
              previous: index > 1 && blocks[index - 1].__typename,
              next: blocks.length > index + 1 && blocks[index + 1].__typename
            }}
            {...props}
          />
        );
      })}
    </div>
  );
}
