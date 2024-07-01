import React from "react";
import ServiceCard2 from "./ServiceCard2";

const ServiceList = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {data?.services?.filter((item) => item.isActive === true).map((item) => (
        <ServiceCard2 key={item._id} item={item} data={data} />
      ))}
    </div>
  );
};

export default ServiceList;
