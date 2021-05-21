import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Portal } from 'react-portal';
import clsx from 'clsx';
import Measure from 'react-measure';
import NextImage from 'next/image';

import { getFullCMSUrl } from '@/lib/url';
import InfoCircleIcon from '@/public/icons/info-circle-duotone.svg';
import Richtext from '@/components/Richtext';

import * as styles from './media.module.css';

export default function Media({
  image = {
    media: null
  },
  className,
  classNameImage,
  classNameCaption,
  showCaption = false,
  captionIconClassName = 'bottom-4 md:bottom-8 left-4 md:left-2',
  ...props
}) {
  const { t } = useTranslation();

  if (!image || !image.media) {
    return null;
  }

  const {
    caption,
    media: { caption: mediaCaption, url, width, height, alternativeText }
  } = image;
  const imageProps = {
    alt: alternativeText,
    src: getFullCMSUrl(url),
    width: props?.layout === 'fill' ? undefined : width,
    height: props?.layout === 'fill' ? undefined : height,
    ...props
  };

  const showCaptionAsOverlay = !showCaption;
  const [isCaptionOpen, setIsCaptionOpen] = useState(showCaption);
  const [captionPosition, setCaptionPosition] = useState(null);
  const captionToggleRef = useRef(null);
  const imageCaption = caption || mediaCaption;
  const hasCaption = !!imageCaption;

  return (
    <Measure
      onResize={() => {
        if (captionToggleRef?.current) {
          setCaptionPosition(captionToggleRef.current.getBoundingClientRect());
        }
      }}
    >
      {({ measureRef }) => (
        <figure
          className={clsx('leading-none relative text-none', className)}
          ref={measureRef}
        >
          <div className={classNameImage}>{<NextImage {...imageProps} />}</div>

          {!showCaption && hasCaption && (
            <button
              type="button"
              onClick={() => {
                setIsCaptionOpen(!isCaptionOpen);
              }}
              ref={captionToggleRef}
              className={clsx(
                'absolute z-30 p-3 sm:p-1 outline-none',
                captionIconClassName
              )}
              aria-label={t(
                isCaptionOpen ? 'media.caption.close' : 'media.caption.open'
              )}
            >
              <InfoCircleIcon
                className={clsx(
                  'w-8 sm:w-10 h-auto hover:text-white opacity-70 mix-blend-multiply hover:opacity-100',
                  styles.infoIcon,
                  isCaptionOpen && styles.infoIconOpen
                )}
              />
            </button>
          )}

          {!showCaption && isCaptionOpen && hasCaption && (
            <Portal>
              <figcaption
                className={clsx(
                  'font-rubik italic text-2xs px-10 py-5 md:p-5 md:pr-0 text-gray-100 bg-black font-rubik-features',
                  classNameCaption,
                  showCaptionAsOverlay &&
                    isCaptionOpen &&
                    'absolute z-30 px-4 md:pr-5',
                  showCaptionAsOverlay && styles.captionOverlay
                )}
                style={{
                  left: captionPosition?.left + captionPosition?.width + 10,
                  top: captionPosition?.top - captionPosition?.height / 2
                }}
              >
                <Richtext content={imageCaption} size="tiny" />
              </figcaption>
            </Portal>
          )}

          {showCaption && (
            <figcaption
              className={clsx(
                'font-rubik italic text-2xs px-0 md:px-10 py-5 md:p-5 md:pr-0 text-gray-600 font-rubik-features',
                classNameCaption
              )}
            >
              <Richtext content={imageCaption} size="tiny" />
            </figcaption>
          )}
        </figure>
      )}
    </Measure>
  );
}
