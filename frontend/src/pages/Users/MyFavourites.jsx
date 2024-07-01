import React from "react";
import CTCard from "../../components/CT/CTCard";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const MyFavourites = () => {
  const {
    data,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/users/user/profile`);

  return (
    <div className="container">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center mt-10 mb-5">
          <h1 className="text-3xl font-bold">Caretaker Favorit</h1>
        </div>

        {loading && <Loading />}
        {!loading && error && <Error errMessage={error} />}
        {!loading && !error && data && (
          <>
            {data.favourites && data.favourites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.favourites.map((ct, index) => (
                  <CTCard key={index} ct={ct} />
                ))}
              </div>
            ) : (
              <div className="gap-5 mt-20 mb-[400px]">
                <p className="text-center font-extrabold text-2xl text-primaryColor">
                  Belum Menambahkan Favorit
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyFavourites;
