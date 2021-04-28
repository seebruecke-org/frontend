export function scaleImageTo(maxWidth, [width, height]) {
  if (maxWidth > width) {
    return [width, height];
  }

  const ratio = Math.min(maxWidth / width, 800 / height);

  return [width * ratio, height * ratio];
}
