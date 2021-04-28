import { mountStoreDevtool } from 'simple-zustand-devtools';
import { appWithTranslation } from 'next-i18next';
import { Toaster } from 'react-hot-toast';

import { StoreProvider } from '../lib/store/store';
import { useHydrate } from '../lib/store/zustand';

import Layout from '@/components/Layout';

import '@/styles/tailwind.css';
import 'swiper/swiper-bundle.css';

function SBApp({ Component, pageProps }) {
  const {
    initialState: { menus, ...initialState },
    ...props
  } = pageProps;

  const store = useHydrate({
    ...initialState
  });

  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    mountStoreDevtool('Store', store);
  }

  return (
    <StoreProvider store={store}>
      <Layout menus={menus}>
        <Toaster />
        <Component {...props} />
      </Layout>
    </StoreProvider>
  );
}

export default appWithTranslation(SBApp);
