import { useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const OurUsers = () => {
  const { data: users, loading, error } = useFetchData(`${BASE_URL}/users`);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleStatus = async (id, isActive) => {
    try {
      const response = await fetch(`${BASE_URL}/users/status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      window.location.reload();
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users
    ?.filter((user) =>
      user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      return order * (a.orders.length - b.orders.length);
    });

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Pengguna Aktif</h1>
      <div className="mb-4 flex flex-col md:flex-row justify-between">
        <input
          type="text"
          placeholder="Cari pengguna..."
          value={searchTerm}
          onChange={handleSearch}
          className="border px-2 py-1 rounded mb-2 md:mb-0"
        />
        <button onClick={handleSort} className="border px-2 py-1 rounded">
          Urutkan pesanan {sortOrder === "asc" ? "⬆️" : "⬇️"}
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
              <th scope="col" className="px-2 md:px-4 py-3">
                Nama Akun
              </th>
              <th scope="col" className="px-2 md:px-4 py-3">
                No.Telepon
              </th>
              <th scope="col" className="px-2 md:px-4 py-3">
                Alamat
              </th>
              <th scope="col" className="px-2 md:px-4 py-3">
                Jumlah pesanan total
              </th>
              <th scope="col" className="px-2 md:px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-2 md:px-4 py-3">
                Actions
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
            {filteredUsers
              ?.filter((user) => user?.name !== "Griyapets")
              .map((user) => (
                <tr
                  key={user?._id}
                  className="bg-white border-b border-gray-300 font-semibold text-headingColor"
                >
                  <th
                    scope="row"
                    className="flex px-2 md:py-3 font-medium whitespace-nowrap"
                  >
                    <img
                      src={user?.photo}
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                    <div className="pl-1  min-w-[180px]">
                      <div className="text-sm md:text-md font-semibold">
                        {user?.name}
                      </div>
                      <div className="text-xs md:text-[12px] text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </th>
                  <td className="text-xs md:text-sm px-1 py-4">
                    {user?.phone}
                  </td>
                  <td className="text-xs md:text-sm px-2 py-4 min-w-[200px]">
                    {user?.address}
                  </td>
                  <td className="text-center px-2 py-4">
                    {user?.orders.length}
                  </td>
                  <td className="text-center text-xs md:text-sm px-2 py-4">
                    {user?.isActive ? "Aktif" : "Nonaktif"}
                  </td>
                  <td className="px-2 py-4">
                    <button
                      onClick={() =>
                        handleToggleStatus(user._id, user.isActive)
                      }
                      className={`px-4 py-2 rounded-full ${
                        user.isActive ? "bg-red-500" : "bg-green-500"
                      } text-white`}
                    >
                      {user.isActive ? "Nonaktifkan" : "Aktifkan"}
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

export default OurUsers;
