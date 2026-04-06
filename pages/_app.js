import { useState, useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { BOOKMARKED_LOCATION_COOKIE_NAME } from '@/lib/constants';
import { useCreateStore, Provider } from '@/lib/store/zustand';
import Layout from '@/components/Layout';
import FacebookPixel from '@/components/FacebookPixel';

import '@/styles/tailwind.css';
import '@/styles/spende.css';
import 'swiper/bundle';

const CookieConsent = dynamic(() => import('react-cookie-consent'), {
  ssr: false
});

function SBApp({ Component, pageProps = {} }) {
  const { initialState = {}, ...props } = pageProps;
  const { menus, ...hydrate } = initialState;
  const bookmarkedLocation = Cookies.get(BOOKMARKED_LOCATION_COOKIE_NAME);

  const router = useRouter();
  const isEnglish = router.locale === 'en' || router.asPath.startsWith('/en');

  const [hasTrackingConsent, setHasTrackingConsent] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('tracking_consent');
    if (consent === 'true') {
      setHasTrackingConsent(true);
    }
  }, []);

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

      {hasTrackingConsent && <FacebookPixel />}

      <Layout menus={menus}>
        <Toaster />
        <Component {...props} />
      </Layout>

      <CookieConsent
        location="bottom"
        buttonText={isEnglish ? 'Accept' : 'Akzeptieren'}
        declineButtonText={
          isEnglish ? 'Only Essential Cookies' : 'Nur essenzielle Cookies'
        }
        enableDeclineButton
        cookieName="tracking_consent"
        expires={365}
        onAccept={() => {
          setHasTrackingConsent(true);
        }}
        disableStyles={true}
        containerClasses="fixed bottom-0 left-0 w-full z-[100] flex flex-col lg:flex-row items-center justify-between p-6 md:p-8 bg-gray-800 text-white border-t border-gray-700 shadow-2xl"
        contentClasses="mb-6 lg:mb-0 lg:mr-8 font-brezel text-small md:text-base max-w-5xl"
        buttonWrapperClasses="flex flex-col sm:flex-row w-full lg:w-auto gap-4"
        buttonClasses="bg-orange-800 hover:bg-orange-900 text-white font-bold py-4 px-8 rounded transition-colors w-full sm:w-auto text-center cursor-pointer text-small md:text-base"
        declineButtonClasses="bg-transparent border border-gray-400 text-gray-300 hover:border-white hover:text-white font-bold py-4 px-8 rounded transition-colors w-full sm:w-auto text-center cursor-pointer text-small md:text-base"
      >
        <p className="mb-3">
          {isEnglish
            ? 'We use cookies and external services (like the Facebook Pixel) to improve our website and our campaigns. Do you agree?'
            : 'Wir nutzen Cookies und externe Dienste (wie den Facebook Pixel), um unsere Webseite und unsere Kampagnen zu verbessern. Bist du damit einverstanden?'}
        </p>

        <div className="text-xs text-gray-400">
          <a
            href={isEnglish ? '/en/imprint' : '/impressum'}
            className="underline hover:text-white transition-colors"
          >
            {isEnglish ? 'Imprint' : 'Impressum'}
          </a>
          <span className="mx-2">|</span>
          <a
            href={isEnglish ? '/en/privacy' : '/datenschutz'}
            className="underline hover:text-white transition-colors"
          >
            {isEnglish ? 'Privacy Policy' : 'Datenschutzerklärung'}
          </a>
        </div>
      </CookieConsent>
    </Provider>
  );
}

export default appWithTranslation(SBApp);
