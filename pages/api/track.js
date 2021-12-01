import Matomo from 'matomo-tracker';

const SITE_ID = process.env.MATOMO_SITE_ID;
const SITE_ENDPOINT = process.env.MATOMO_ENDPOINT;

const tracker =
  SITE_ID && SITE_ENDPOINT
    ? new Matomo(SITE_ID, `${SITE_ENDPOINT}/matomo.php`)
    : null;

export default function (req, res) {
  if (!tracker || !req?.query) {
    return;
  }

  const { url } = req.query;

  tracker.track(`https://${process.env.NEXT_PUBLIC_VERCEL_DOMAIN}${url}`);

  res.send({});
}
