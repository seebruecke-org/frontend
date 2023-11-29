import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';

export default function Fundraisingbox({ scriptUrl }) {
  const { t } = useTranslation();

  const scriptRoot = useRef(); // gets assigned to a root node
  const script = `<script type='text/javascript' src=${scriptUrl} ></script>`;

  useEffect(() => {
    // creates a document range (grouping of nodes in the document is my understanding)
    // in this case we instantiate it as empty, on purpose
    const range = document.createRange();
    // creates a mini-document (light weight version), in our range with our script in it
    const documentFragment = range.createContextualFragment(script);
    // appends it to our script root - so it renders in the correct location
    scriptRoot.current.append(documentFragment);
  });

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
