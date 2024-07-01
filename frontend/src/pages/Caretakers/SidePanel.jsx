import React from "react";
import { Link, useParams } from "react-router-dom";

const SidePanel = ({ timeSlots, services }) => {
  const { id } = useParams();

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md ">
      <h1 className="text-2xl font-bold text-primary mb-4 text-center">
        {" "}
        INFORMASI
      </h1>
      <div className="mt-5">
        <p className="text__para mt-0 font-semibold text-headingColor">
          Jam buka :
        </p>

        <div className="mt-3">
          {timeSlots?.map((item, i) => (
            <ul key={i}>
              {item.day === "Hari ini Libur" ? (
                <li className="flex items-center justify-center mb-2">
                  <p className="text-[18px] leading-6 font-extrabold text-red-700 bg-red-100 p-1 rounded-lg">
                    Hari Ini Libur
                  </p>
                </li>
              ) : (
                <li className="flex items-center justify-between mb-2">
                  <p className="text-[16px] leading-6 font-semibold">
                    {item.day}
                  </p>
                  <p className="text-[16px] leading-6 font-semibold">
                    {item.startingTime} - {item.endingTime}
                  </p>
                </li>
              )}
            </ul>
          ))}
        </div>
      </div>
      <div className="items-center justify-between mt-5">
        <p className="text__para mt-0 font-semibold text-headingColor">
          Layanan Tersedia:
        </p>
        <div className="flex flex-col gap-3 mt-3">
          {services?.map((item, i) => (
            <ul key={i}>
              <li className={`text-[12px] leading-4 lg:text-[16px] lg:leading-7  font-semibold ${item.isActive === false ? 'text-red-700' : ''}`}>
              - {item.isActive === false ? <span className="text-red-700">{item.servName}(Penuh/Libur)</span> : item.servName}
              </li>
            </ul>
          ))}
        </div>
      </div>
      <Link to={`/select/${id}`}>
        <button className="btn px-2 w-full rounded-md">Pilih Layanan</button>
      </Link>
    </div>
  );
};

export default SidePanel;
