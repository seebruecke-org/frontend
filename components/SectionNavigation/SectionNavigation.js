import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import SwiperCore, { Keyboard, Mousewheel, Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import ChevronLeftIcon from '@/public/icons/chevron-left-regular.svg';
import ChevronRightIcon from '@/public/icons/chevron-right-regular.svg';
import StrapiLink from '@/components/StrapiLink';

import { arePathsEqual } from '@/lib/slug';

import * as styles from './sectionNavigation.module.css';

SwiperCore.use([Navigation, Keyboard, Mousewheel, A11y]);

export default function SectionNavigation({
  items = [],
  className,
  primaryGrid = true
}) {
  const { asPath } = useRouter();
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [allowNext, setAllowNext] = useState(false);
  const [allowPrev, setAllowPrev] = useState(false);
  const activeSlideIndex =
    items.findIndex(({ url }) => arePathsEqual(asPath, url)) || 0;

  useEffect(() => {
    if (swiperInstance) {
      setAllowNext(swiperInstance.virtualSize > swiperInstance.width);
    }
  }, [swiperInstance]);

  return (
    <div
      className={clsx(
        'bg-orange-200',
        primaryGrid && 'grid grid-layout-primary',
        'py-6 sm:py-7 md:py-8 relative',
        styles.navigation,
        className
      )}
    >
      <span
        className={clsx(
          'w-full bg-gray-400 absolute top-0 left-0 opacity-50 mix-blend-multiply',
          styles.border
        )}
      />

      <nav
        className={clsx(
          primaryGrid && 'col-span-full md:col-start-3 md:col-span-10',
          'relative w-full px-8 md:px-0'
        )}
      >
        {allowPrev && (
          <button
            type="button"
            className={clsx(
              'absolute top-0 h-full left-0 z-10 flex items-center',
              styles.fadeOutStart
            )}
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slidePrev();
              }
            }}
          >
            <ChevronLeftIcon className="w-5 h-auto ml-2 mr-10 flex-shrink-0" />
          </button>
        )}

        <Swiper
          freeMode
          slidesPerView="auto"
          spaceBetween={8}
          initialSlide={activeSlideIndex}
          mousewheel={{
            forceToAxis: true
          }}
          onSlideChange={({ isBeginning, isEnd }) => {
            setAllowNext(!isEnd);
            setAllowPrev(!isBeginning);
          }}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          {items.map((item, index) => {
            const isActive = arePathsEqual(asPath, item.url);

            return (
              // eslint-disable-next-line react/jsx-key
              <SwiperSlide className={styles.slide}>
                <StrapiLink
                  link={item}
                  className={clsx(
                    'block py-3 px-3 md:p-3 uppercase font-rubik font-rubik-features font-bold text-xs md:text-base leading-none whitespace-nowrap hover:bg-white col-span-2 text-center',
                    isActive && 'bg-white',
                    index === 0 && 'col-start-2'
                  )}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {allowNext && (
          <button
            type="button"
            className={clsx(
              'absolute top-0 h-full right-0 z-10 flex items-center',
              styles.fadeOutEnd
            )}
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slideNext();
              }
            }}
          >
            <ChevronRightIcon className="w-5 h-auto ml-10 mr-2 flex-shrink-0" />
          </button>
        )}
      </nav>
    </div>
  );
}
