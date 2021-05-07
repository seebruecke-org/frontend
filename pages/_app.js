import { mountStoreDevtool } from 'simple-zustand-devtools';
import { appWithTranslation } from 'next-i18next';
import { Toaster } from 'react-hot-toast';

import { StoreProvider } from '../lib/store/store';
import { useHydrate } from '../lib/store/zustand';

import Head from 'next/head';
import Layout from '@/components/Layout';

import '@/styles/tailwind.css';
import 'swiper/swiper-bundle.css';

function SBApp({ Component, pageProps = {} }) {
  const { initialState = {}, ...props } = pageProps;
  const { menus, ...hydrate } = initialState;

  const store = useHydrate({
    ...hydrate
  });

  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    mountStoreDevtool('Store', store);
  }

  return (
    <StoreProvider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/static/manifest.json" />
      </Head>

      <Layout menus={menus}>
        <Toaster />
        <Component {...props} />
      </Layout>
    </StoreProvider>
  );
}

export default appWithTranslation(SBApp);
