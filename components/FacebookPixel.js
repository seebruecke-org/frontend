import { useEffect } from 'react';
import { useRouter } from 'next/router';

const FacebookPixel = () => {
  const router = useRouter();

  useEffect(() => {
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

    window.fbq('init', '2250513878773856');
    window.fbq('track', 'PageView');
    window._fbPixelInitialized = true;
    console.log('FP initialized successfully');
  }, []);

  useEffect(() => {
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

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src="https://www.facebook.com/tr?id=2250513878773856&ev=PageView&noscript=1"
      />
    </noscript>
  );
};

export default FacebookPixel;
