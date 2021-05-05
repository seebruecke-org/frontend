import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SEO({ title, metadata: origMetadata = {} }) {
  const { asPath } = useRouter();
  const metadata = origMetadata || {};
  const domain =
    process.env.VERCEL_ENV === 'production'
      ? process.env.NEXT_PUBLIC_VERCEL_DOMAIN
      : process.env.NEXT_PUBLIC_VERCEL_URL;

  metadata['twitter_card'] = 'summary_large_image';
  metadata['twitter_site'] = '_Seebruecke_';

  if (Object.keys(metadata).length === 0) {
    metadata['twitter_image'] = {
      url: `https://${domain}/public/twitter-preview.png`
    };

    metadata['facebook_image'] = {
      url: `https://${domain}/public/facebook-preview.png`
    };
  }

  return (
    <Head>
      <title>{title} | Seebrücke</title>

      <meta name="theme-color" content="#f55511" />

      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />

      {metadata &&
        Object.keys(metadata).map((key) => {
          let prefix = '';
          let value = metadata[key];

          if (key.startsWith('facebook')) {
            prefix = 'og:';
          } else if (key.startsWith('twitter')) {
            prefix = 'twitter:';
          }

          if (prefix === 'twitter:' || prefix === 'og:') {
            const normalizedKey = key.split('_')[1];

            if (normalizedKey === 'image') {
              value = value?.url
                ? `https://${process.env.NEXT_PUBLIC_CMS_DOMAIN}/${value.url}`
                : `https://${domain}/api/screenshot?url=https://${domain}${asPath}`;
            }

            return (
              <meta property={`${prefix}${normalizedKey}`} content={value} />
            );
          } else {
            return <meta name={key} content={value} />;
          }
        })}
    </Head>
  );
}
