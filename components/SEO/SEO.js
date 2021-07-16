import { useRouter } from 'next/router';
import Head from 'next/head';

import { getFullClientUrl } from '@/lib/url';

export default function SEO({ title, metadata: defaultMetadata }) {
  const { asPath } = useRouter();

  const metadata = {
    ...{
      'twitter:image': getFullClientUrl(
        `/api/screenshot?url=${getFullClientUrl(asPath)}`
      ),

      'og:image': getFullClientUrl(
        `/api/screenshot?url=${getFullClientUrl(asPath)}`
      )
    },
    ...defaultMetadata
  };

  return (
    <Head>
      <title>{title} | Seebrücke</title>

      <meta name="theme-color" content="#f55511" />

      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />

      {metadata &&
        Object.entries(metadata).map(([key, value]) => (
          <meta name={key} content={value} key={`meta-${key}-${value}`} />
        ))}
    </Head>
  );
}
