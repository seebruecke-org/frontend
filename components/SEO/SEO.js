import Head from 'next/head';

export default function SEO({ title, metadata }) {
  return (
    <Head>
      <title>{title} | SEEBRÜCKE</title>

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

            if (normalizedKey === 'image' && value) {
              value = value.url;
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
