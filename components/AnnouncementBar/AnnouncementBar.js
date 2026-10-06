import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function AnnouncementBar() {
  const router = useRouter();
  const locale = router.locale;
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [shouldShowAnnouncement, setShouldShowAnnouncement] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasAnnouncementParam = true; //params.has('with_announcement');

    if (hasAnnouncementParam) {
      setShouldShowAnnouncement(true);
      const isClosed = localStorage.getItem('announcementClosed');
      if (!isClosed) {
        setIsAnnouncementOpen(true);
      }
    }
  }, []);

  const handleClose = () => {
    setIsAnnouncementOpen(false);
    localStorage.setItem('announcementClosed', 'true');
  };

  if (!shouldShowAnnouncement) {
    return null;
  }

  // remove announcement bar at the top on thank you page
  if (window.location.pathname.indexOf("/danke-seite-dauer") > -1) {
    return null;
  }

  return (
    <div className="bg-orange-200 text-black w-full">
      <div className="max-w-wide mx-auto">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
          className="w-full text-center py-3 px-5"
        >
          <p className="font-rubik text-xs md:text-small hover:underline">
            {locale === 'en' ? 'Donate for sustainable activism!' : 'Spende für nachhaltigen Aktivismus!'}
          </p>
        </button>

        {/* Body */}
        {isAnnouncementOpen && (
          <div className="flex flex-col md:flex-row gap-24 pt-12 pb-12 px-8 xl:px-0">
            {/* Image * /}
            <div className="flex justify-center items-center max-w-xl">
              <Image
                src="/socks.png"
                alt={locale === 'en' ? 'For Freedom of Movement Seebrücke' : 'Für Bewegungsfreiheit Seebrücke'}
                width={600}
                height={600}
                className="w-full h-auto rounded"
              />
            </div>
            */}

            {/* Content */}
            <div className="flex flex-col justify-center">
              <h2 className="font-rubik-features max-w-full font-rubik leading-tight text-large md:text-2xl font-bold break-words sm:break-normal tracking-tight">
                {locale === 'en' ? 'Donate for sustainable activism!' : 'Spende für nachhaltigen Aktivismus!'}
              </h2>
              <p class="font-brezel text-base md:text-medium leading-tight mt-5">
                {locale === 'en'
                  ? 'Activism takes energy, time, and money.'
                  : 'Aktivismus kostet Energie, Zeit und Geld.'}
                <br />
                {locale === 'en'
                  ? 'It enables us to continue organizing independently and launching campaigns—for a society based on solidarity.'
                  : 'Damit wir uns weiterhin unabhängig organisieren und Kampagnen auf die Beine stellen können – für eine solidarische Gesellschaft.'}
                <br />
                {locale === 'en'
                  ? 'Even a monthly contribution of €5, €10, or €15 makes a difference!'
                  : 'Bereits 5€/10€/15€ monatlich helfen dabei!'}
              </p>
              <div className="flex flex-row space-y-4 pt-4">
                <div class=" mt-8 md:mt-12">
                  <a
                    href={locale === 'en' ? '/en/donate' : '/spenden'}
                    className="font-rubik font-bold text-small md:text-base uppercase py-4 sm:py-5 md:py-6 px-7 sm:px-8 md:px-10 rounded-full inline-block text-center bg-white text-black hover:bg-black hover:text-white cta_cta__fPLnO"
                  >
                    {locale === 'en' ? 'Donate Now' : 'Jetzt Spenden'}
                  </a>
                  <button
                    onClick={handleClose}
                    className="font-rubik text-small md:text-base underline hover:no-underline py-4 sm:py-5 md:py-6 px-7 sm:px-8 md:px-10 ml-4"
                  >
                    {locale === 'en' ? 'Close' : 'Schließen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
