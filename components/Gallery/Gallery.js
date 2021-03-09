import SwiperCore, { Keyboard, Mousewheel, Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import Measure from 'react-measure';

SwiperCore.use([Navigation, Keyboard, Mousewheel, A11y]);

export default function Gallery({ items }) {
  const [offsetLet, setOffsetLeft] = useState({});
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

      {offsetLet && (
        <div className="col-span-full overflow-hidden relative">
          {currentSlideIndex > 0 && (
            <button
              type="button"
              style={{
                backgroundImage:
                  'linear-gradient(to left, rgba(255, 255, 255, 0), white)'
              }}
              className="h-full w-20 absolute top-0 left-0 z-10 hidden md:block"
              onClick={() => {
                if (swiperInstance) {
                  swiperInstance.slidePrev();
                }
              }}
            >
              Previous
            </button>
          )}

          <Swiper
            freeMode
            slidesPerView="auto"
            spaceBetween={30}
            mousewheel={true}
            onSlideChange={({ activeIndex }) => {
              setCurrentSlideIndex(activeIndex);
            }}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
          >
            <SwiperSlide style={{ width: `${offsetLet - 30}px` }} />

            {items.map(({ media }) => (
              <SwiperSlide style={{ width: '35%' }}>
                <img src={media} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            type="button"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255, 255, 255, 0), white)'
            }}
            className="h-full w-20 absolute top-0 right-0 z-10 hidden md:block"
            onClick={() => {
              if (swiperInstance) {
                swiperInstance.slideNext();
              }
            }}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
