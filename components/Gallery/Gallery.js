import SwiperCore, { Keyboard, Mousewheel, Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import clsx from 'clsx';
import Measure from 'react-measure';

import ChevronLeftIcon from '@/public/icons/chevron-left-regular.svg';
import ChevronRightIcon from '@/public/icons/chevron-right-regular.svg';
import Media from '@/components/Media';

import * as styles from './gallery.module.css';

SwiperCore.use([Navigation, Keyboard, Mousewheel, A11y]);

const SLIDE_GAP = 20;

export default function Gallery({ items, priority = false }) {
  if (!items) {
    return null;
  }

  const [offsetLeft, setOffsetLeft] = useState({});
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  return (
    <>
      <Measure
        offset
        onResize={({ offset: { left } }) => {
          setOffsetLeft(left);
        }}
      >
        {({ measureRef }) => (
          <div
            className="col-span-full md:col-start-3 md:col-span-10"
            ref={measureRef}
          />
        )}
      </Measure>

      <div className="col-span-full overflow-hidden relative">
        {currentSlideIndex > 1 && (
          <button
            type="button"
            className={clsx(
              'h-full w-20 absolute top-0 left-0 z-10 hidden md:flex justify-center pr-16 pl-8',
              styles.controlPrev
            )}
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slidePrev();
              }
            }}
            aria-label="Previous Slide"
          >
            <ChevronLeftIcon className="w-6 h-auto flex-shrink-0" />
          </button>
        )}

        <Swiper
          freeMode
          slidesPerView="auto"
          spaceBetween={SLIDE_GAP}
          mousewheel={{
            forceToAxis: true
          }}
          onSlideChange={({ activeIndex }) => {
            setCurrentSlideIndex(activeIndex);
          }}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          {offsetLeft > 0 && (
            <SwiperSlide style={{ width: `${offsetLeft - SLIDE_GAP}px` }} />
          )}

          {items.map((item, index) => (
            // eslint-disable-next-line react/jsx-key
            <SwiperSlide className={styles.slide}>
              <Media image={item} priority={index < 3 && priority} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className={clsx(
            'h-full pl-16 pr-8 absolute top-0 right-0 z-10 hidden md:flex justify-center',
            styles.controlNext
          )}
          onClick={() => {
            if (swiperInstance) {
              swiperInstance.slideNext();
            }
          }}
          aria-label="Next Slide"
        >
          <ChevronRightIcon className="w-6 h-auto flex-shrink-0" />
        </button>
      </div>
    </>
  );
}
