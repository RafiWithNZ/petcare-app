import React from "react";

import heroImg01 from "../assets/images/hero-img01.png";
import heroImg02 from "../assets/images/hero-img02.png";
import heroImg03 from "../assets/images/hero-img03.png";
import icon01 from "../assets/images/icon01.png";
import icon02 from "../assets/images/icon02.png";
import icon03 from "../assets/images/icon03.png";
import faqImg from "../assets/images/faq-img.jpg";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import FaqList from "../components/Faq/FaqList";
import Testimonial from "../components/Testimonial/Testimonial";
import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <>
      {/* ============ Hero Section ===========*/}

      <>
        <section className="hero__section pt-[60px] 2xl:h-[800px]">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">
              {/* ========= hero content ========= */}
              <div>
                <div className="lg:w-[570px]">
                  <h1 className="text-[36px] leading-[46px] font-[800] text-headingColor md:text-[60px] md:leading-[70px] ">
                    Berikan Perawatan Terbaik untuk Peliharaan Tercinta.
                  </h1>
                  <p className="text__para">
                    Peliharaan yang sehat merupakan kebahagiaan pemiliknya
                  </p>

                  <Link
                    to="/caretaker"
                    className="btn flex items-center w-[270px] gap-3 mt-5"
                  >
                    Temukan Layanan Terbaik
                  </Link>
                </div>

                {/* ========= hero counter ========= */}

                {/* <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                      30+
                    </h2>
                    <span className="w-[100px] h-2 bg-yellowColor rounded-full block mt-[-14px]"></span>
                    <p className="text__para">Caretaker telah Bergabung</p>
                  </div>

                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                      70+
                    </h2>
                    <span className="w-[100px] h-2 bg-irisBlueColor rounded-full block mt-[-14px]"></span>
                    <p className="text__para">Layanan Professional</p>
                  </div>

                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                      100+
                    </h2>
                    <span className="w-[100px] h-2 bg-purpleColor rounded-full block mt-[-14px]"></span>
                    <p className="text__para">Pelanggan Puas</p>
                  </div>
                </div> */}
              </div>
              {/* ========= hero content ========= */}

              <div className="flex gap-[30px] justify-end">
                <div>
                  <img className="w-full" src={heroImg01} alt="" />
                </div>
                <div>
                  <img src={heroImg02} className="w-full mb-[30px]" />
                  <img src={heroImg03} className="w-full ml-[30px]" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* =========== Hero Section End =========== */}

        <section>
          <div className="container">
            <div className="lg:w-[700px] mx-auto">
              <h2 className="heading text-center font-bold">
                Menyediakan Layanan Professional untuk Hewan Anda
              </h2>
              <p className="text__para text-center">
                Menghubungkan para pecinta hewan dengan tenaga perawat
                professional dan berpengalaman.
              </p>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 
            lg:gap-[30px] mt-[30px] lg:mt-[55px] "
            >
              <div className="py-[30px] px-5">
                <div className="flex items-center justify-center">
                  <img src={icon01} alt="" />
                </div>

                <div className="mt-[30px]">
                  <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                    Temukan Caretaker
                  </h2>
                  <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                    Disini para perawat professional kami sebut caretaker,
                    temukan mereka sesuai kebutuhan anda.
                  </p>

                  <Link
                    to="/caretaker"
                    className="w-[44px] h-[44px] rounded-full border border-solid
                   border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor 
                   hover:border-none "
                  >
                    <BsArrowRight className="group-hover:text-white" />
                  </Link>
                </div>
              </div>

              <div className="py-[30px] px-5">
                <div className="flex items-center justify-center">
                  <img src={icon02} alt="" />
                </div>

                <div className="mt-[30px]">
                  <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                    Cari Lokasi yang Sesuai
                  </h2>
                  <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                    Para Caretaker ada di penjuru negeri dan siap melayani Anda.
                    Sesuaikan dengan lokasi Anda saat ini.
                  </p>

                  <Link
                    to="/caretaker"
                    className="w-[44px] h-[44px] rounded-full border border-solid
                   border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor 
                   hover:border-none "
                  >
                    <BsArrowRight className="group-hover:text-white" />
                  </Link>
                </div>
              </div>

              <div className="py-[30px] px-5">
                <div className="flex items-center justify-center">
                  <img src={icon03} alt="" />
                </div>

                <div className="mt-[30px]">
                  <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                    Pesan Layanan
                  </h2>
                  <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                    Para Caretaker siap melayani Anda kapanpun dan apa pun
                    kebutuhan Anda, pesan layanan terbaik mereka.
                  </p>

                  <Link
                    to="/caretaker"
                    className="w-[44px] h-[44px] rounded-full border border-solid
                   border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor 
                   hover:border-none "
                  >
                    <BsArrowRight className="group-hover:text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <About /> */}

        {/* =========== FAQ section =========== */}
        <section>
          <div className="container">
            <div className="flex justify-between gap-[50px] lg:gap-0">
              <div className="hidden md:block md:w-1/2">
                <img
                  className="md:w-[440px] md:ml-[70px]"
                  src={faqImg}
                  alt=""
                />
              </div>

              <div className="w-full md:w-1/2">
                <h2 className="heading font-bold">
                  Pertanyaan-pertanyaan teratas dari para pelanggan
                </h2>

                <FaqList />
              </div>
            </div>
          </div>
        </section>

        {/* =========== FAQ section end =========== */}

        {/* =========== testimonial section =========== */}
        {/* <section>
          <div className="container">
            <div className="xl:w-[470px] mx-auto">
              <h2 className="heading font-bold text-center">
                Testimoni dari para pemilik hewan
              </h2>
              <p className="text__para text-center mt-5">
                Utarakan pendapat jujur Anda dari pelayanan-pelayanan yang telah
                anda pesan
              </p>
            </div>

            <Testimonial />
          </div>
        </section> */}
        {/* ========== testimonial section end=========== */}

        {/* =========== footer section =========== */}
      </>
      <Footer />
    </>
  );
};

export default Home;
