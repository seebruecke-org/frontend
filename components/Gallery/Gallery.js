import SwiperCore, {Keyboard, Mousewheel, Navigation, A11y} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import {useState} from 'react';
import clsx from 'clsx';
import Measure from 'react-measure';

import ChevronLeftIcon from '@/public/icons/chevron-left-regular.svg';
import ChevronRightIcon from '@/public/icons/chevron-right-regular.svg';
import Media from '@/components/Media';

import * as styles from './gallery.module.css';

SwiperCore.use([Navigation, Keyboard, Mousewheel, A11y]);

const SLIDE_GAP = 20;

function ControlButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={clsx(
        'px-8 md:px-6 py-4 md:py-2 justify-center hover:bg-gray-200 focus:bg-gray-200 focus:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Gallery({ items, layout, priority = false }) {
  if (!items) {
    return null;
  }

  if (layout === 'Carousel') {
    return GalleryCarousel({items, priority});
  }

  if (layout === 'Compact') {
    return GalleryCompact({items, priority});
  }
}

function GalleryCompact({items, priority = false}) {
  return (
    <div className="col-span-full md:col-start-3 md:col-span-9 space-y-10 mb-5 md:mb-10 mt-5 md:mt-10">
      <div className="galery galery-compact gap-8 grid grid-flow-col">
        {items.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <Media image={item} priority={index < 3 && priority}/>
        ))}
      </div>
    </div>
  );
}

function GalleryCarousel({items, priority = false}) {

  const [offsetLeft, setOffsetLeft] = useState({});
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  return (
    <div className="grid grid-layout-primary col-span-full my-10 md:my-20">
      <Measure
        offset
        onResize={({offset: {left}}) => {
          setOffsetLeft(left);
        }}
      >
        {({measureRef}) => (
          <div
            className="col-span-full md:col-start-3 md:col-span-10"
            ref={measureRef}
          />
        )}
      </Measure>

      <div className="col-span-full overflow-hidden relative">
        <div className="flex justify-end mb-12">
          <ControlButton
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slidePrev();
              }
            }}
            disabled={currentSlideIndex < 1}
            aria-label="Previous Slide"
            className={currentSlideIndex < 1 && 'text-gray-400'}
          >
            <ChevronLeftIcon className="w-4 md:w-6 h-auto flex-shrink-0" />
          </ControlButton>

          <ControlButton
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slideNext();
              }
            }}
            aria-label="Next Slide"
            disabled={currentSlideIndex + 2 === items.length}
            className={
              currentSlideIndex + 2 === items.length && 'text-gray-400'
            }
          >
            <ChevronRightIcon className="w-4 md:w-6 h-auto flex-shrink-0" />
          </ControlButton>
        </div>

        <Swiper
          freeMode
          slidesPerView="auto"
          spaceBetween={SLIDE_GAP}
          mousewheel={{
            forceToAxis: true
          }}
          onSlideChange={({activeIndex}) => {
            setCurrentSlideIndex(activeIndex);
          }}
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          {offsetLeft > 0 && (
            <SwiperSlide style={{width: `${offsetLeft - SLIDE_GAP}px`}}/>
          )}

          {items.map((item, index) => (
            // eslint-disable-next-line react/jsx-key
            <SwiperSlide className={styles.slide}>
              <Media image={item} priority={index < 3 && priority}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
