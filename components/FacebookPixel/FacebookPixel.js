import { useEffect } from 'react';
import { useRouter } from 'next/router';

const FacebookPixel = () => {
  const router = useRouter();
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  useEffect(() => {
    if (!pixelId) {
      return;
    }

    // Check if already initialized
    if (window.fbq && window._fbPixelInitialized) {
      console.log('FP already initialized');
      return;
    }

    // Initialize Facebook Pixel
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
    window._fbPixelInitialized = true;
    console.log('FP initialized with purchase part successfully');

    // track a purchase if we are on a page like:
    // https://www.seebruecke.org/danke-seite-dauer/?amount=%amount%&project=%project%&product=spende&email=%email%
    let argStr = window.location.href.split("?")[1];
    if (argStr && (window.location.pathname.indexOf("/danke-seite") == 0)) {
      let argArr = argStr.split("&");
      let amountVal = null;
      let productVal = null;
      for (let i = 0; i < argArr.length; i++) {
        let keyVal = argArr[i].split("=");
        if (keyVal[0] === "amount") {
          amountVal = keyVal[1];
        }
        if (keyVal[0] === "product") {
          productVal = keyVal[1];
        }
      }

      if (amountVal && (productVal === "spende")) {
        console.log("tracking " + amountVal + " purchase!");
        window.fbq('track', 'Purchase', {
          value: amountVal,
          currency: 'EUR',
          content_ids: [],
          content_type: 'product',
          num_items: 1
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!pixelId) {
      return;
    }

    // Track page view on route change
    const handleRouteChange = () => {
      if (window.fbq) {
        window.fbq('track', 'PageView');
        console.log('FP tracked PageView on route change');
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  if (!pixelId) {
    return null;
  }

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
};

export default FacebookPixel;
