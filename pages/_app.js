import { mountStoreDevtool } from 'simple-zustand-devtools';
import { appWithTranslation } from 'next-i18next';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

import { useHydrate, Provider } from '@/lib/store/zustand';
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
    <Provider initialStore={store}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Layout menus={menus}>
        <Toaster />
        <Component {...props} />
      </Layout>
    </Provider>
  );
}

export default appWithTranslation(SBApp);
