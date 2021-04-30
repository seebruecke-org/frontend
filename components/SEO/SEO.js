import Head from 'next/head';

export default function SEO({ title, metadata: origMetadata = {} }) {
  const metadata = origMetadata || {};

  if (Object.keys(metadata).length === 0) {
    metadata['twitter_image'] = {
      url: process.env.NEXT_PUBLIC_VERCEL_URL + '/public/twitter-preview.png'
    };

    metadata['facebook_image'] = {
      url: process.env.NEXT_PUBLIC_VERCEL_URL + '/public/facebook-preview.png'
    };
  }

  return (
    <Head>
      <title>{title} | SEEBRÜCKE</title>

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
              if (value?.url) {
                value = `${process.env.NEXT_PUBLIC_CMS_DOMAIN}/${value.url}`;
              } else {
                value = `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/screenshot?url=${process.env.NEXT_PUBLIC_VERCEL_URL}`;
              }
            }

            if (!value) {
              return null;
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
