import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';

const SCRIPT_ID = 'fundraisingbox-script';

export default function Fundraisingbox({ scriptUrl }) {
  const { t } = useTranslation();

  const scriptRoot = useRef(); // gets assigned to the root node the widget injects into

  useEffect(() => {
    if (!scriptUrl || !scriptRoot.current) {
      return undefined;
    }

    // Only ever inject the widget once. Without this guard the script was
    // re-appended on every render (e.g. on menu changes), which loaded the
    // box multiple times and could leave it failing to initialise.
    if (document.getElementById(SCRIPT_ID)) {
      return undefined;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = scriptUrl;
    script.async = true;
    script.onerror = () => {
      console.error(
        '[Fundraisingbox] failed to load widget script:',
        scriptUrl
      );
    };

    scriptRoot.current.append(script);

    return () => {
      script.remove();
    };
  }, [scriptUrl]);

  return (
    <div>
      {/* This div is used by the FB to inject all it's content */}
      <div id="fbIframeDiv" className="relative" ref={scriptRoot} />
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
