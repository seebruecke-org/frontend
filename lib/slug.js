export function slugsToUri(slugs, options = {}) {
  let { prefix = '', appendix = '' } = options;

  if (prefix) {
    prefix = `/${prefix}`;
  }

  if (appendix) {
    appendix = `${appendix}/`;
  }

  return `${prefix}/${slugs.join('/')}/${appendix}`;
}
