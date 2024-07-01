import React from "react";
import starIcon from "../../assets/images/Star.png";
import { Link } from "react-router-dom";

const CTCard = ({ ct }) => {
  const {
    name,
    averageRating,
    totalRating,
    photo,
    specialization,
    orders,
    address,
  } = ct;

  const totalOrders = orders?.length || 0;

  return (
    <Link to={`/caretakers/${ct._id}`}>
      <div className="p-3 lg:p-5 shadow-xl rounded-2xl">
        <div>
          <img
            src={photo}
            className="w-[500px] h-[300px] object-contain rounded-md"
            alt=""
          />
        </div>

        <h2
          className="text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 font-[700] text-headingColor mt-3
        lg:mt-5 "
        >
          {name}
        </h2>

        <div className="flex flex-wrap gap-2 mt-2">
          {specialization?.map((item) => (
            <span
              key={item}
              className="bg-[#CCF0F3] text-irisBlueColor px-2 py-1 text-[12px]
         leading-4 lg:text-[14px] lg:leading-7 font-semibold rounded "
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-2 ">
          <div className="flex items-center gap-[6px]">
            <span
              className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7
          font-semibold text-headingColor"
            >
              <img src={starIcon} alt="" /> {averageRating}
            </span>

            <span
              className="text-[14px] leading-6 lg:text-[16px] lg:leading-7
          font-[400] text-textColor"
            >
              ({totalRating})
            </span>
          </div>
        </div>

        <div className="mt-2 lg:mt-4 flex items-center justify-between">
          <div>
            <h3
              className="text-[16px] leading-7 lg:text-[18px] lg:leading-[30px]
             font-semibold text-headingColor"
            >
              +{totalOrders} Orders
            </h3>
            <p
              className="text-[14px] leading-7 lg:text-[16px] lg:leading-8 
          font-[400] text-textColor"
            >
              {address}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CTCard;
