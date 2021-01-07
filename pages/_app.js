import { mountStoreDevtool } from 'simple-zustand-devtools';

import { StoreProvider } from '../lib/store/store'
import { useHydrate } from '../lib/store/zustand'

import Layout from '@/components/Layout';

import "@/styles/tailwind.css";

export default function SBApp({ Component, pageProps }) {
  const store = useHydrate({
    ...pageProps.initialState
  });

  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    mountStoreDevtool('Store', store);
  }

  return <StoreProvider store={store}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </StoreProvider>
};
