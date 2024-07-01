import React from "react";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const Helpdesk = () => {
  const { data, loading, error } = useFetchData(`${BASE_URL}/helpdesk`);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Kritik & Saran</h1>
      <div
        className={`${
          window.innerWidth <= 768
            ? "max-w-[350px] overflow-x-scroll"
            : "max-w-full"
        }`}
      >
        <table className="w-full text-center text-md text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 md:px-4 py-3">
                Email
              </th>
              <th scope="col" className="px-2 md:px-4 py-3 min-w-5xl">
                Subject
              </th>
              <th scope="col" className="px-2 md:px-4 py-3 min-w-[400px]">
                Pesan
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="3" className="h-20 text-center">
                  <div className="flex justify-center items-center">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="3" className="h-20 text-center">
                  <div className="flex justify-center items-center">
                    <Error errMessage={error} />
                  </div>
                </td>
              </tr>
            )}
            {data.map((item) => (
              <tr
                key={item?._id}
                className="bg-white border-b border-gray-300 font-semibold text-xs md:text-base text-headingColor"
              >
                <td className="px-2 md:px-4 py-4">{item?.email}</td>
                <td className="px-2 md:px-4 py-4">{item?.subject}</td>
                <td className="px-2 md:px-4 py-4">{item?.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Helpdesk;
