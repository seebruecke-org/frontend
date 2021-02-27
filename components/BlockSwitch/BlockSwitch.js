import contentBlocks from '@/components/Blocks';

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

  return (
    <div className={`grid grid-layout-primary ${className}`}>
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
