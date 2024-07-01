import React from "react";

import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const Overview = () => {
  const {
    data: data,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/users/user/profile`);

  const totalPetsCount = data.pets
    ? data.pets.filter((pet) => pet._id).length
    : 0;

  const totalActiveBookCount = data.orders
    ? data.orders.filter((order) => order.status === "Pending" || order.status === "Diproses").length
    : 0;

  const totalBookCount = data.orders
    ? data.orders.filter((order) => order).length
    : 0;

  return (
    <div className="p-5 md:p-10 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-10 md:text-4xl">Overview</h1>
      {loading && !error && <Loading />}
      {error && !loading && <Error errMessage={error} />}

      {!loading && !error && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-lg p-10">
            <div className="flex items-center justify-center">
              <figure className="w-[150px] h-[150px] md:w-[250px] md:h-[250px] flex items-center justify-center border border-gray-300 rounded-md">
                <img src={data?.photo} className="object-contain rounded-md" />
              </figure>
            </div>

            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-[12px] md:text-[14px] lg:text-[16px] font-bold">Nama</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]  font-bold">Email</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]  font-bold">Telepon</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]  font-bold">Gender</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]  font-bold">Alamat</p>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-[450px]">
                <p className="text-[12px] md:text-[14px] lg:text-[16px]  font-bold">: {data?.name}</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]  font-bold">: {data?.email}</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]  font-bold">: {data?.phone}</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]  font-bold">: {data?.gender}</p>
                <p className="text-[12px] md:text-[14px] lg:text-[16px]  font-bold whitespace-normal">: {data?.address}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4">
              <h2 className="text-md lg:text-lg font-bold">
                Hewan Dimiliki : {totalPetsCount}{" "}
              </h2>
              <ul className="list-disc list-inside mt-4">
                {data?.pets?.map((pet) => (
                  <li key={pet._id} className="flex items-center gap-2 mb-3">
                    <img
                      src={pet.photo}
                      className="w-[50px] h-[50px] rounded-full object-cover"
                      alt={pet.petName}
                    />
                    <p className="text-md lg:text-lg font-semibold ml-3">{pet.petName}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <div className="shadow-xl rounded-lg bg-[#F8F6E3] p-4">
                <p className="text-md lg:text-lg font-bold">Jumlah Booking Aktif:</p>
                <span className="text-lg lg:text-2xl font-bold">{totalActiveBookCount}</span>
              </div>
              <div className="shadow-xl rounded-lg bg-[#F7F7F7] p-4 flex-grow">
                <p className="text-md lg:text-lg font-bold">Jumlah Booking Total:</p>
                <span className="text-md lg:text-2xl font-bold">{totalBookCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
