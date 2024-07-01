import React from "react";
import aboutImg from "../../assets/images/about.jpg";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section>
      <div className="container">
        <div className="flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row">
          {/* ========= about image ========= */}
          <div className="relative w-3/4 md:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1">
            <img className="rounded-2xl w-[580px] h-[420px] ml-4" src={aboutImg} alt="" />
            <div
              className="absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-35%] md:right-[-7%]
                lg:right-[22%]"
            >
            </div>
          </div>

          {/* ========= about content ========= */}
          <div className="w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2">
            <h2 className="heading font-bold">
              Bangga menjadi bagian dari Griyapets
            </h2>
            <p className="text__para mt-20 text-justify">
              Alhamdulliah, setelah bergabung menjadi salah satu mitra{" "}
              <strong>Griyapets</strong> proses pemesanan layanan saya menjadi
              lebih efisien dan terorganisir dengan baik.
            </p>
            <p className="text__para mt-3 text-justify">
              Selain itu, <strong>Griyapets</strong> juga memberikan kemudahan
              dalam berkomunikasi dengan pelanggan saya sehingga proses
              pemesanan layanan lebih cepat
            </p>

            <Link to="/">
              <button className="btn">Pelajari Lebih Lanjut</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
