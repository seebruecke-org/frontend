import { BLOCK_PREFIX } from './constants';

export function normalizeBlockName(blockName) {
  return blockName.startsWith(BLOCK_PREFIX) === false
    ? `${BLOCK_PREFIX}${blockName}`
    : blockName;
}

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

export function blockNameMatches(blockNameA, blockNameB) {
  if (!blockNameA || !blockNameB) {
    return false;
  }

  return normalizeBlockName(blockNameA) === normalizeBlockName(blockNameB);
}
