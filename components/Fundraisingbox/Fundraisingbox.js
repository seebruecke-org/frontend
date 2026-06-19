import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';

const SCRIPT_ID = 'fundraisingbox-script';
const MAX_ATTEMPTS = 3;
// Conservative backstop: only retry on a silent failure if no iframe has
// appeared well after a normal load would have finished.
const LOAD_TIMEOUT_MS = 12000;

export default function Fundraisingbox({ scriptUrl }) {
  const { t } = useTranslation();

  const scriptRoot = useRef(); // root node the widget injects its iframe into
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const root = scriptRoot.current;

    if (!scriptUrl || !root) {
      return undefined;
    }

    let attempt = 0;
    let settled = false;
    let timeoutId;
    let script;

    // The widget renders by injecting an <iframe> into the root once the
    // external script has loaded and initialised.
    const hasLoaded = () => !!root.querySelector('iframe');

    function clearTimer() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
    }

    function removeScript() {
      if (script) {
        script.onerror = null;
        script.remove();
        script = null;
      }
      const stale = document.getElementById(SCRIPT_ID);
      if (stale) {
        stale.remove();
      }
    }

    function succeed() {
      settled = true;
      clearTimer();
      observer.disconnect();
      // Retries can occasionally leave more than one iframe behind; keep one.
      const iframes = root.querySelectorAll('iframe');
      for (let i = 1; i < iframes.length; i += 1) {
        iframes[i].remove();
      }
      setFailed(false);
    }

    function fail() {
      settled = true;
      clearTimer();
      observer.disconnect();
      removeScript();
      console.error(
        `[Fundraisingbox] widget failed to load after ${MAX_ATTEMPTS} attempts:`,
        scriptUrl
      );
      setFailed(true);
    }

    function retry() {
      if (settled) {
        return;
      }
      if (attempt >= MAX_ATTEMPTS) {
        fail();
        return;
      }
      console.warn(
        `[Fundraisingbox] load attempt ${attempt} failed, retrying…`
      );
      load();
    }

    function load() {
      attempt += 1;
      clearTimer();
      removeScript();

      // Start each attempt from a clean slate so a late-arriving iframe from a
      // previous attempt can't leave a duplicate behind.
      root.innerHTML = '';

      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'text/javascript';
      script.src = scriptUrl;
      script.async = true;
      script.onerror = retry;
      root.append(script);

      timeoutId = setTimeout(() => {
        if (!settled && !hasLoaded()) {
          retry();
        }
      }, LOAD_TIMEOUT_MS);
    }

    const observer = new MutationObserver(() => {
      if (!settled && hasLoaded()) {
        succeed();
      }
    });

    observer.observe(root, { childList: true, subtree: true });
    load();

    return () => {
      settled = true;
      clearTimer();
      observer.disconnect();
      removeScript();
    };
  }, [scriptUrl, reloadKey]);

  return (
    <div>
      {/* This div is used by the FB to inject all it's content */}
      <div id="fbIframeDiv" className="relative" ref={scriptRoot} />

      {failed && (
        <p className="mt-4">
          {t('fundraisingbox.loadError')}{' '}
          <button
            type="button"
            className="underline font-bold"
            onClick={() => {
              setFailed(false);
              setReloadKey((key) => key + 1);
            }}
          >
            {t('fundraisingbox.retry')}
          </button>
        </p>
      )}

      <noscript>{t('fundraisingbox.activateJS')}</noscript>

      <a
        target="_blank"
        href="https://www.fundraisingbox.com"
        rel="noopener noreferrer"
      >
        <img
          src="https://secure.fundraisingbox.com/images/FundraisingBox-Logo-Widget.png"
          alt={t('fundraisingbox.logoAlt')}
          border="0"
        />
      </a>
    </div>
  );
}
