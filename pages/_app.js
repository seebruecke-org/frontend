import { appWithTranslation } from 'next-i18next'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Head from 'next/head'

import { BOOKMARKED_LOCATION_COOKIE_NAME } from '@/lib/constants'
import { useCreateStore, Provider } from '@/lib/store/zustand'
import Layout from '@/components/Layout'

import '@/styles/tailwind.css'
import '@/styles/spende.css'
import 'swiper/swiper-bundle.css'

function SBApp({ Component, pageProps = {} }) {
  const { initialState = {}, ...props } = pageProps
  const { menus, ...hydrate } = initialState
  const bookmarkedLocation = Cookies.get(BOOKMARKED_LOCATION_COOKIE_NAME)
  const router = useRouter()

  const createStore = useCreateStore({
    ...hydrate,
    bookmarkedLocation: bookmarkedLocation
      ? JSON.parse(bookmarkedLocation)
      : null
  })

  // useEffect(() => {
  //   const trackRouteChange = (url) => {
  //     fetch(`/api/track?url=${url}`);
  //   };
  //
  //   router.events.on('routeChangeComplete', trackRouteChange);
  //
  //   return () => {
  //     router.events.off('routeChangeComplete', trackRouteChange);
  //   };
  // }, []);

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
  )
}

export default appWithTranslation(SBApp)
