function normalizePathSlashes(path) {
  let normalized = path;

  if (!normalized) {
    return path;
  }

  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  return normalized.toLocaleLowerCase();
}

export function arePathsEqual(pathA, pathB) {
  return normalizePathSlashes(pathA) === normalizePathSlashes(pathB);
}
