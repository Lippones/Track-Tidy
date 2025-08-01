'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import Image from 'next/image'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export function SwiperCarousel() {
  const slides = [
    {
      id: 1,
      image: '/random11.jpeg',
      alt: 'Green fabric texture'
    },
    {
      id: 2,
      image: '/random11.jpeg',
      alt: 'Person with headphones silhouette'
    },
    {
      id: 3,
      image: '/random11.jpeg',
      alt: 'Wooden honey dipper'
    },
    {
      id: 4,
      image: '/random11.jpeg',
      alt: 'Abstract geometric pattern'
    },
    {
      id: 5,
      image: '/random11.jpeg',
      alt: 'Minimalist design object'
    }
  ]

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
        // pagination={{
        //   clickable: true,
        //   bulletClass: 'swiper-pagination-bullet',
        //   bulletActiveClass: 'swiper-pagination-bullet-active'
        // }}
        navigation={false}
        breakpoints={{
          640: {
            slidesPerView: 1.5,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          }
        }}
        className="mt-12 h-full flex items-center justify-center"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative overflow-hidden h-full rounded-2xl shadow-lg transition-transform duration-300 py-12">
              <Image
                src={slide.image || '/placeholder.svg'}
                alt={slide.alt}
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-4xl"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
