import { mountStoreDevtool } from 'simple-zustand-devtools';
import { I18nProvider } from 'next-localization';
import { useRouter } from 'next/router';

import { StoreProvider } from '../lib/store/store'
import { useHydrate } from '../lib/store/zustand'

import Layout from '@/components/Layout';

import "@/styles/tailwind.css";

export default function SBApp({ Component, pageProps }) {
  const router = useRouter();
  const store = useHydrate({
    ...pageProps.initialState
  });
  const { translations, ...props } = pageProps;

  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    mountStoreDevtool('Store', store);
  }

  return <I18nProvider lngDict={translations} locale={router.locale}>
    <StoreProvider store={store}>
      <Layout>
        <Component {...props} />
      </Layout>
    </StoreProvider>
  </I18nProvider>
};
