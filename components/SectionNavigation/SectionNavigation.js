import { useRouter } from 'next/router';
import { useState, useEffect, forwardRef, useRef } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import useWindowWidth from '@/lib/hooks/useWindowWidth';
import ChevronLeftIcon from '@/public/icons/chevron-left-regular.svg';
import ChevronRightIcon from '@/public/icons/chevron-right-regular.svg';
import StrapiLink from '@/components/StrapiLink';

import { arePathsEqual } from '@/lib/slug';

import * as styles from './sectionNavigation.module.css';

const SwiperContainer = dynamic(() => import('./Swiper'), {
  ssr: false
});

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

function Wrapped({ swiper = false, items, setItemRef = () => {} }) {
  const { asPath } = useRouter();
  const [allowNext, setAllowNext] = useState(false);
  const [allowPrev, setAllowPrev] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const activeSlideIndex =
    items.findIndex(({ url }) => arePathsEqual(asPath, url)) || 0;

  useEffect(() => {
    if (swiperInstance) {
      setAllowNext(swiperInstance.virtualSize > swiperInstance.width);
    }
  }, [swiperInstance]);

  if (swiper) {
    return (
      <>
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

        <SwiperContainer
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
          slideClassName={styles.slide}
        >
          {items.map((item, index) => {
            const isActive = arePathsEqual(asPath, item.url);

            return (
              <StrapiLink
                link={item}
                className={clsx(
                  'block py-3 px-2 md:p-3 uppercase font-rubik font-rubik-features font-bold text-xs md:text-base leading-none whitespace-nowrap col-span-2 text-center',
                  isActive ? 'bg-white' : 'hover:bg-white',
                  index === 0 && 'col-start-2'
                )}
              />
            );
          })}
        </SwiperContainer>

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
      </>
    );
  }

  return (
    <div className="flex space-x-2 lg:space-x-4 overflow-x-hidden">
      {items.map((item, index) => {
        const isActive = arePathsEqual(asPath, item.url);

        return (
          <StrapiLink
            link={item}
            className={clsx(
              'block py-3 px-2 md:p-3 uppercase font-rubik font-rubik-features font-bold text-xs md:text-base leading-none whitespace-nowrap col-span-2 text-center',
              isActive ? 'bg-white' : 'hover:bg-white',
              index === 0 && 'col-start-2'
            )}
            ref={(ref) => setItemRef(ref)}
          />
        );
      })}
    </div>
  );
}

export default forwardRef(function SectionNavigation(
  { items = [], className, primaryGrid = true, alwaysShowBorder = false },
  ref
) {
  const containerRef = useRef(null);
  const itemRefs = [];
  const [useSwiper, setUseSwiper] = useState(false);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (itemRefs.length === items.length) {
      const containerWidth = containerRef?.current?.clientWidth;
      const itemsWidth = itemRefs.reduce((acc, item) => {
        acc += item?.clientWidth ?? 0;

        return acc;
      }, 0);

      setUseSwiper(itemsWidth > containerWidth);
    }
  }, [containerRef, itemRefs, windowWidth]);

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
        ref={containerRef}
      >
        <Wrapped
          swiper={useSwiper}
          items={items}
          setItemRef={(ref) => itemRefs.push(ref)}
        />
      </nav>
    </div>
  );
});
