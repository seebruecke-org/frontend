// Allowed hostnames for URLs
const HOSTNAMES = ['seebruecke.org', 'localhost:3000', 'seeb.uber.space'];

export function isValidUrl(string) {
  try {
    return !!new URL(string);
  } catch (_) {
    return false;
  }
}

export function isValidSeebrueckeUrl(string) {
  const url = new URL(string);

  return (
    isValidUrl(string) &&
    (HOSTNAMES.includes(url.host) ||
      url.host.endsWith('seebruecke-org.vercel.app'))
  );
}

export function getFullCMSUrl(path) {
  return `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${path}`;
}

export function getFullClientUrl(path) {
  const domain =
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? process.env.NEXT_PUBLIC_VERCEL_DOMAIN
      : process.env.NEXT_PUBLIC_VERCEL_URL;

  return `https://${domain}${path}`;
}
