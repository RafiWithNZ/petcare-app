import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CTCard from "../../components/CT/CTCard";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const Caretakers = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "";

  const [query, setQuery] = useState(initialCategory);
  const [debouncedQuery, setDebouncedQuery] = useState(initialCategory);

  const handleSearch = () => {
    setQuery(query.trim());
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  const {
    data: ctData,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/caretakers?query=${debouncedQuery}`);

  return (
    <>
      <div className="bg-[#fff9ea] py-8">
        <h2 className="heading font-extrabold text-center">
          Temukan Caretaker Terbaik
        </h2>
        <div
          className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center 
            justify-between "
        >
          <input
            type="search"
            className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer
            placeholder:text-textColor"
            placeholder="Cari Caretaker (Nama toko, tag, lokasi)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="btn mt-0 rounded-[0px] rounded-r-md"
            onClick={handleSearch}
          >
            Cari
          </button>
        </div>
      </div>

      <div className="container mt-5">
        {loading && !error && <Loading />}
        {error && !loading && <Error errMessage={error} />}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {ctData
              .filter((ct) => ct.isApproved === true && ct.isActive === true)
              .map((ct, i) => (
                <CTCard key={i} ct={ct} />
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Caretakers;
