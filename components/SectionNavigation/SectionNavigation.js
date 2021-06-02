import { useRouter } from 'next/router';
import { useState, useEffect, forwardRef } from 'react';
import clsx from 'clsx';
import SwiperCore, { Keyboard, Mousewheel, Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import ChevronLeftIcon from '@/public/icons/chevron-left-regular.svg';
import ChevronRightIcon from '@/public/icons/chevron-right-regular.svg';
import StrapiLink from '@/components/StrapiLink';

import { arePathsEqual } from '@/lib/slug';

import * as styles from './sectionNavigation.module.css';

SwiperCore.use([Navigation, Keyboard, Mousewheel, A11y]);

function Control({ direction, ...props }) {
  const isDirectionPrev = direction === 'prev';
  const Icon = isDirectionPrev ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      className={clsx(
        'absolute -top-1 h-full z-10 flex items-center',
        isDirectionPrev
          ? 'left-0 md:-left-4 pl-4 pr-2'
          : 'right-0 md:-right-4 pr-4 pl-2',
        isDirectionPrev ? styles.fadeOutStart : styles.fadeOutEnd
      )}
      {...props}
    >
      <Icon
        className={clsx(
          'w-4 h-auto flex-shrink-0 mix-blend-multiply opacity-40'
        )}
      />
    </button>
  );
}

export default forwardRef(function SectionNavigation(
  { items = [], className, primaryGrid = true, alwaysShowBorder = false },
  ref
) {
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
      ref={ref}
      className={clsx(
        'bg-orange-200',
        primaryGrid && 'grid grid-layout-primary',
        'py-6 sm:py-7 md:py-8 relative -top-px',
        styles.navigation,
        className
      )}
    >
      <span
        className={clsx(
          'w-full bg-gray-400 absolute top-0 left-0 opacity-50 mix-blend-multiply',
          alwaysShowBorder ? 'block' : 'hidden md:block',
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
          <Control
            direction="prev"
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slidePrev();
              }
            }}
          />
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
                    'block py-3 px-2 md:p-3 uppercase font-rubik font-rubik-features font-bold text-xs md:text-base leading-none whitespace-nowrap col-span-2 text-center',
                    isActive ? 'bg-white' : 'hover:bg-white',
                    index === 0 && 'col-start-2'
                  )}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {allowNext && (
          <Control
            direction="next"
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slideNext();
              }
            }}
          />
        )}
      </nav>
    </div>
  );
});
