import gutenbergBlocks from '@/components/Blocks';

export async function enrichBlocks(blocks) {
  const gutenBergBlocksWithTransforms = Object.keys(gutenbergBlocks).filter(
    (blockName) => {
      return !!gutenbergBlocks[blockName].transform;
    }
  );

  const transforms = blocks.map((block) => {
    const { __typename } = block;

    if (gutenBergBlocksWithTransforms.includes(__typename)) {
      return gutenbergBlocks[__typename].transform(block);
    }

    return block;
  });

  return Promise.all(transforms);
}
