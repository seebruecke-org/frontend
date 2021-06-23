import { Swiper, SwiperSlide } from 'swiper/react';
import { deepMap } from 'react-children-utilities';
import SwiperCore, { Keyboard, Mousewheel, Navigation, A11y } from 'swiper';

SwiperCore.use([Navigation, Keyboard, Mousewheel, A11y]);

export default function SectionNavigationSwiperContainer({
  children,
  slideClassName,
  ...props
}) {
  const slides = deepMap(children, (child) => {
    return <SwiperSlide className={slideClassName}>{child}</SwiperSlide>;
  });

  return <Swiper {...props}>{slides}</Swiper>;
}
