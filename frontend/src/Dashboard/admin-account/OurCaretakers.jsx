import { useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const OurCaretakers = () => {
  const {
    data: ctData,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/caretakers`);
  const [sortOrder, setSortOrder] = useState("asc");
  const [ratingOrder, setRatingOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleStatus = async (id, isActive) => {
    try {
      const response = await fetch(`${BASE_URL}/caretakers/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update caretaker status");
      }

      // Refresh data after status update
      window.location.reload();
    } catch (error) {
      console.error("Failed to update caretaker status", error);
    }
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleRatingSort = () => {
    setRatingOrder(ratingOrder === "asc" ? "desc" : "asc");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCaretakers = ctData
    ?.filter(
      (ct) =>
        ct?.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        ct.isApproved === true
    )
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      const ratingOrderValue = ratingOrder === "asc" ? 1 : -1;
      return (
        order * (a.orders.length - b.orders.length) ||
        ratingOrderValue *
          (a.averageRating === 0
            ? 0
            : a.averageRating - (b.averageRating === 0 ? 0 : b.averageRating))
      );
    });

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Seller Aktif</h1>
      <div className="mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Cari caretaker..."
          value={searchTerm}
          onChange={handleSearch}
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleSort} className="border px-2 py-1 rounded">
          Urutkan pesanan {sortOrder === "asc" ? "⬆️" : "⬇️"}
        </button>
        <button onClick={handleRatingSort} className="border px-2 py-1 rounded">
          Urutkan rating {ratingOrder === "asc" ? "⬆️" : "⬇️"}
        </button>
      </div>
      <div
        className={`${
          window.innerWidth <= 768
            ? "max-w-[350px] overflow-x-scroll"
            : "max-w-full"
        }`}
      >
        <table className="w-full text-left text-md text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 md:px-13 py-3">
                Nama Akun
              </th>
              <th scope="col" className="px-2 md:px-13 py-3">
                No. Telepon
              </th>
              <th scope="col" className="px-2 md:px-13 py-3">
                Alamat
              </th>
              <th scope="col" className="px-2 md:px-13 py-3">
                Jumlah pesanan total
              </th>
              <th scope="col" className="px-2 md:px-13 py-3">
                Rating Toko
              </th>
              <th scope="col" className="px-2 md:px-13 py-3">
                Status
              </th>
              <th scope="col" className="px-2 md:px-13 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="h-20 text-center">
                  <div className="flex justify-center items-center">
                    <Loading />
                  </div>
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="6" className="h-20 text-center">
                  <div className="flex justify-center items-center">
                    <Error errMessage={error} />
                  </div>
                </td>
              </tr>
            )}
            {filteredCaretakers?.map((ct) => (
              <tr
                key={ct?._id}
                className="bg-white border-b border-gray-300 font-semibold text-headingColor"
              >
                <th
                  scope="row"
                  className="flex px-2 md:py-3 font-medium whitespace-nowrap"
                >
                  <img
                    src={ct?.photo}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                  <div className="pl-1  min-w-[180px]">
                    <div className="text-sm md:text-md font-semibold">
                      {ct?.name}
                    </div>
                    <div className="text-xs md:text-[12px] text-gray-500">
                      {ct?.email}
                    </div>
                  </div>
                </th>
                <td className="text-xs md:text-sm px-1 py-4">{ct?.phone}</td>
                <td className="text-xs md:text-sm px-2 py-4">{ct?.address}</td>
                <td className="text-center px-2 py-4">{ct?.orders.length}</td>
                <td className="text-center px-2 py-4">⭐{ct?.averageRating}</td>
                <td className="text-centertext-xs md:text-sm px-2 py-4">
                  {ct?.isActive ? "Aktif" : "Nonaktif"}
                </td>
                <td className="px-2 py-4">
                  <button
                    onClick={() => handleToggleStatus(ct._id, ct.isActive)}
                    className={`px-4 py-2 rounded-full ${
                      ct.isActive ? "bg-red-500" : "bg-green-500"
                    } text-white`}
                  >
                    {ct.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OurCaretakers;
