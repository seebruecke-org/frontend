// Allowed hostnames for URLs
const HOSTNAMES = [
  'neu.seebruecke.org',
  'seebruecke.org',
  'frontend-git-develop-seebruecke-org.vercel.app',
  'localhost:3000',
  'seeb.uber.space'
];

export function isValidUrl(string) {
  try {
    return !!new URL(string);
  } catch (_) {
    return false;
  }
}

export function isValidSeebrueckeUrl(string) {
  const url = new URL(string);

  return HOSTNAMES.includes(url.host) && isValidUrl(string);
}
