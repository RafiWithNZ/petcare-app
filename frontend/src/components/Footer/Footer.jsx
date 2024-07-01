import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import {
  AiFillInstagram,
  AiFillFacebook,
  AiFillTwitterCircle,
} from "react-icons/ai";

const socialLinks = [
  {
    path: "https://www.instagram.com/rafi.nuril/",
    icon: <AiFillInstagram className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "https://www.facebook.com/profile.php?id=100009402211022",
    icon: <AiFillFacebook className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "",
    icon: <AiFillTwitterCircle className="group-hover:text-white w-4 h-5" />,
  },
];

const quickLinks01 = [
  {
    path: "/",
    display: "Beranda",
  },
  {
    path: "/",
    display: "Tentang Kami",
  },
  {
    path: "/",
    display: "Layanan",
  },
  {
    path: "/",
    display: "Blog",
  },
];

const quickLinks02 = [
  {
    path: "/",
    display: "Temukan Caretaker",
  },
  {
    path: "/",
    display: "Reservasi pesanan",
  },
  {
    path: "/",
    display: "Temukan caretaker terdekat",
  },
  {
    path: "/",
    display: "Bagikan Opini Anda",
  },
];

const quickLinks03 = [
  {
    path: "/",
    display: "Dukung Kami",
  },
  {
    path: "/",
    display: "Kontak Kami",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="pb-16 pt-10 ">
      <div className="container">
        <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px]">
          <div>
            <img className="w-[160px] h-[40px]" src={logo} alt="" />
            <p className="text-[16px] leading-7 font-[400] text-textColor">
              Copyright © {year} developed by Rafi Nuril, All Right Reserved.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            {socialLinks.map((link, index) => (
              <Link
                to={link.path}
                key={index}
                className="w-9 h-9 border border-solid border-[#181A1E] rounded-full 
                  flex items-center justify-center group hover:bg-primaryColor hover:border-none"
              >
                {link.icon}
              </Link>
            ))}
          </div>
          {/* 
          <div>
            <h2 className="text-[20px] leading-[30px] font-[700] text-headingColor mb-6">
              Quick Links
            </h2>

            <ul>
              {quickLinks01.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    to={item.path}
                    className="text-[16px] leading-7 font-[500] text-textColor"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] leading-[30px] font-[700] text-headingColor mb-6">
              Saya ingin :
            </h2>

            <ul>
              {quickLinks02.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    to={item.path}
                    className="text-[16px] leading-7 font-[500] text-textColor"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] leading-[30px] font-[700] text-headingColor mb-6">
              Support
            </h2>

            <ul>
              {quickLinks03.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    to={item.path}
                    className="text-[16px] leading-7 font-[500] text-textColor"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
