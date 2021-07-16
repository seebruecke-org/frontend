import { appWithTranslation } from 'next-i18next';
import { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Head from 'next/head';

import { BOOKMARKED_LOCATION_COOKIE_NAME } from '@/lib/constants';
import { useCreateStore, Provider } from '@/lib/store/zustand';
import Layout from '@/components/Layout';

import '@/styles/tailwind.css';
import 'swiper/swiper-bundle.css';

function SBApp({ Component, pageProps = {} }) {
  const { initialState = {}, ...props } = pageProps;
  const { menus, ...hydrate } = initialState;
  const bookmarkedLocation = Cookies.get(BOOKMARKED_LOCATION_COOKIE_NAME);

  const createStore = useCreateStore({
    ...hydrate,
    bookmarkedLocation: bookmarkedLocation
      ? JSON.parse(bookmarkedLocation)
      : null
  });

  return (
    <Provider createStore={createStore}>
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
