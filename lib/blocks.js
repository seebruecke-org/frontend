export function getFirstBlockName(blocks) {
  if (blocks && Array.isArray(blocks) && blocks.length > 0) {
    return blocks[0].__typename;
  }

  return null;
}

export function getLastBlockName(blocks) {
  if (blocks && Array.isArray(blocks) && blocks.length > 0) {
    const lastIndex = blocks.length - 1;
    return blocks[lastIndex].__typename;
  }

  return null;
}
