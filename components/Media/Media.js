import { useState } from 'react';
import clsx from 'clsx';
import NextImage from 'next/image';

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
  captionIconClassName = 'bottom-8 left-8',
  ...props
}) {
  if (!image || !image.media) {
    return null;
  }

  const {
    caption,
    media: { caption: mediaCaption, url, width, height }
  } = image;
  const imageProps = {
    src: `${process.env.NEXT_PUBLIC_CMS_DOMAIN}${url}`,
    width: props?.layout === 'fill' ? undefined : width,
    height: props?.layout === 'fill' ? undefined : height,
    ...props
  };

  const showCaptionAsOverlay = !showCaption;
  const [isCaptionOpen, setIsCaptionOpen] = useState(showCaption);
  const imageCaption = caption || mediaCaption;
  const hasCaption = !!imageCaption;

  return (
    <figure className={clsx('leading-none text-none relative', className)}>
      <div className={classNameImage}>{<NextImage {...imageProps} />}</div>

      {!showCaption && hasCaption && (
        <button
          type="button"
          onClick={() => {
            setIsCaptionOpen(!isCaptionOpen);
          }}
          className={clsx('absolute', captionIconClassName)}
        >
          <InfoCircleIcon
            className={clsx(
              'w-10 h-auto hover:text-white',
              styles.infoIcon,
              isCaptionOpen && styles.infoIconOpen
            )}
          />
        </button>
      )}

      {isCaptionOpen && hasCaption && (
        <figcaption
          className={clsx(
            'font-rubik italic text-2xs px-10 py-5 md:p-5 md:pr-0 text-gray-600 font-rubik-features',
            classNameCaption,
            showCaptionAsOverlay &&
              isCaptionOpen &&
              'absolute -bottom-8 left-16 bg-white z-20 px-4 md:pr-5',
            showCaptionAsOverlay && styles.captionOverlay
          )}
        >
          <Richtext content={imageCaption} size="tiny" />
        </figcaption>
      )}
    </figure>
  );
}
