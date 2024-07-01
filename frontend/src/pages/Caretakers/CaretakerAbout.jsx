import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";


const CaretakerAbout = ({ name, about, pictures }) => {
  return (
    <div className="max-w-[400px] lg:max-w-[1170px] mx-auto px-5">
      <div className="mb-5">
        <h3 className="text-[24px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
          Tentang
          <span className="text-irisBlueColor font-bold text-[24px] leading-9">
            {name}
          </span>
        </h3>
      </div>
      <Swiper
        modules={[Pagination]}
        spaceBetween={5}
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {pictures?.map((item, index) => (
          <SwiperSlide key={index}>
            <PhotoProvider>
              <PhotoView src={item}>
                <img
                  src={item}
                  alt=""
                  className="w-[500px] lg:w-full lg:h-full object-cover cursor-pointer"
                />
              </PhotoView>
            </PhotoProvider>
          </SwiperSlide>
        ))}
      </Swiper>
      <div>
        <h1 className="text-[20px] leading-[30px] text-headingColor font-semibold">
          Deskripsi :
        </h1>
        <p
          className="text__para"
          dangerouslySetInnerHTML={{ __html: about }}
        ></p>
      </div>
    </div>
  );
};

export default CaretakerAbout;
