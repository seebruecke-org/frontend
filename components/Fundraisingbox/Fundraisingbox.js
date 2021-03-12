import { useI18n } from 'next-localization';
import Script from 'react-load-script';

export default function Fundraisingbox({ scriptUrl }) {
  const i18n = useI18n();

  return (
    <div>
      {/* This div is used by the FB to inject all it's content */}
      <div id="fbIframeDiv" className="relative" />

      <Script url={scriptUrl} />

      <noscript>{i18n.t('fundraisingbox.activateJS')}</noscript>

      <a
        target="_blank"
        href="https://www.fundraisingbox.com"
        rel="noopener noreferrer"
      >
        <img
          src="https://secure.fundraisingbox.com/images/FundraisingBox-Logo-Widget.png"
          alt={i18n.t('fundraisingbox.logoAlt')}
          border="0"
        />
      </a>
    </div>
  );
}
