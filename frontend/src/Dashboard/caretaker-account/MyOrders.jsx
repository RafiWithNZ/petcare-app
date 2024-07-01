import { useState, useContext } from "react";
import { toast } from "react-toastify";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";
import { HiCheck, HiX, HiAnnotation } from "react-icons/hi";
import { formateDate } from "../../utils/formateDate";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import Loading from "../../components/Loader/Loading";
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [tab, setTab] = useState("activeOrders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [load, setLoad] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");

  const { user } = useContext(authContext);
  const navigate = useNavigate();

  const toggleModalOpen = () => setIsModalOpen(!isModalOpen);

  const { data: orders, loading } = useFetchData(`${BASE_URL}/my-orders`);

  const filterOrders = () => {
    if (!orders) return [];
    return orders.filter((order) => {
      if (tab === "activeOrders") {
        return order.status === "Pending" || order.status === "Diproses";
      } else if (tab === "completedOrders") {
        return (
          order.status === "Selesai" ||
          order.status === "Ditolak" ||
          order.status === "Dibatalkan"
        );
      }
      return true;
    });
  };

  const sortOrders = (orders) => {
    return orders.sort((a, b) => {
      if (sortCriteria === "date") {
        const dateA = new Date(a.orderDate);
        const dateB = new Date(b.orderDate);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortCriteria === "serviceName") {
        const nameA = a.orderedService.servName.toLowerCase();
        const nameB = b.orderedService.servName.toLowerCase();
        if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
        if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });
  };

  const filteredOrders = sortOrders(filterOrders());

  const updateOrderStatus = async (itemId, statusEndpoint) => {
    setLoad(true);
    try {
      const res = await fetch(
        `${BASE_URL}/my-orders/${statusEndpoint}/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to update order status");

      const { message } = await res.json();
      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoad(false);
    }
  };

  const handleContact = async (buyerId) => {
    const sellerId = user._id;
    const conversationId = sellerId + buyerId;

    try {
      const res = await fetch(`${BASE_URL}/conversations/${conversationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        navigate(`/message/${data.data.id}`);
      } else if (res.status === 404) {
        const createRes = await fetch(`${BASE_URL}/conversations/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            to: buyerId,
          }),
        });

        const createData = await createRes.json();
        navigate(`/message/${createData.data.id}`);
      } else {
        throw new Error(`Failed to fetch conversation: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative mx-auto px-4 max-w-full">
      <h1 className="text-lg md:text-3xl font-bold mb-[50px] mt-4">
        Pesanan Saya
      </h1>
      <div className="flex justify-between items-center mb-5">
        <select
          value={tab}
          onChange={(e) => setTab(e.target.value)}
          className="mt-2 p-2 border border-primaryColor rounded-md"
        >
          <option value="activeOrders" className="text-[12px] md:text-[16px]">
            Pesanan Aktif
          </option>
          <option
            value="completedOrders"
            className="text-[12px] md:text-[16px]"
          >
            Pesanan Selesai
          </option>
        </select>
        <div className="flex items-center gap-2">
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="mt-2 p-2 border border-primaryColor rounded-md"
          >
            <option value="date">Menurut Tanggal</option>
            <option value="serviceName">Menurut Layanan</option>
          </select>
          {sortCriteria === "date" ? (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-2 p-2 border border-primaryColor rounded-md"
            >
              <option value="asc">Terbaru</option>
              <option value="desc">Terlama</option>
            </select>
          ) : (
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-2 p-2 border border-primaryColor rounded-md"
            >
              <option value="asc">Keatas</option>
              <option value="desc">Menurun</option>
            </select>
          )}
        </div>
      </div>
      <div
        className={`${
          window.innerWidth <= 768
            ? "max-w-[350px] overflow-x-scroll"
            : "max-w-full"
        }`}
      >
        <table className="w-full text-md text-gray-500">
          <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 md:px-13 py-3">
                Pemesan
              </th>
              <th scope="col" className="px-2 md:px-10 py-3">
                Tanggal
              </th>
              <th scope="col" className="px-2 md:px-6 py-3">
                Info Pesanan
              </th>
              <th scope="col" className="px-2 md:px-6 py-3">
                Harga
              </th>
              <th scope="col" className="px-2 md:px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-2 md:px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {loading ? (
              <tr>
                <td colSpan="7" className="h-20 text-center">
                  <div className="flex justify-center items-center">
                    <Loading />
                  </div>
                </td>
              </tr>
            ) : (
              load && (
                <tr>
                  <td colSpan="7" className="h-20 text-center">
                    <div className="flex justify-center items-center">
                      <p className="text-primaryColor font-semibold gap-2">
                        Tunggu Sebentar..
                      </p>
                    </div>
                  </td>
                </tr>
              )
            )}
            {filteredOrders.map((item) => (
              <tr
                key={item._id}
                className="bg-white border-b border-gray-300 font-semibold text-headingColor"
              >
                <th scope="row" className="flex px-2 md:p-2 font-medium">
                  <img
                    src={item.user?.photo}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                  <div className="pl-1">
                    <div className="text-sm md:text-base text-left font-semibold">
                      {item.user?.name}
                    </div>
                    <div className="hidden md:inline md:text-[14px] text-gray-500">
                      {item.user?.email}
                    </div>
                  </div>
                </th>
                <td className="px-2 md:px-3 py-4 text-xs md:text-[15px]">
                  {formateDate(item.orderDate)}
                </td>
                <td className="px-2 md:px-3 py-4">
                  <button
                    className="bg-primaryColor py-1 px-5 text-white rounded-md"
                    onClick={() => {
                      setSelectedPet(item.selectedPet);
                      setSelectedService(item.orderedService);
                      toggleModalOpen();
                    }}
                  >
                    Lihat
                  </button>
                </td>
                <td className="px-2 md:px-6 py-4">
                  {item.orderedService?.price}
                </td>
                <td className="px-2 md:px-6 py-4">{item.status}</td>

                {tab === "activeOrders" && (
                  <td className="px-2 md:px-6 py-4 flex items-center gap-2">
                    {item.status === "Pending" && (
                      <>
                        <button
                          className="text-white p-2 rounded-md flex items-center gap-1 bg-green-500"
                          onClick={() => updateOrderStatus(item._id, "accept")}
                        >
                          <HiCheck className="w-2 h-2 md:w-5 md:h-5" /> Terima
                        </button>
                        <button
                          className="text-white p-2 rounded-md flex items-center gap-1 bg-red-500"
                          onClick={() => updateOrderStatus(item._id, "reject")}
                        >
                          <HiX className="w-2 h-2 md:w-5 md:h-5" /> Tolak
                        </button>
                        <button
                          className="text-white font-semibold bg-orange-400 p-2 rounded-lg"
                          onClick={() => handleContact(item.user?._id)}
                        >
                          <HiAnnotation size={25} />
                        </button>
                      </>
                    )}

                    {["Diproses"].includes(item.status) && (
                      <>
                        <button
                          className="text-white p-2 rounded-md flex items-center gap-2 bg-purple-500"
                          onClick={() =>
                            updateOrderStatus(item._id, "complete")
                          }
                        >
                          <HiCheck className="w-2 h-2 md:w-5 md:h-5" /> Selesai
                        </button>
                        <button
                          className="text-white font-semibold bg-orange-400 p-2 rounded-lg"
                          onClick={() => handleContact(item.user?._id)}
                        >
                          <HiAnnotation size={25} />
                        </button>
                      </>
                    )}
                  </td>
                )}
                {tab === "completedOrders" && (
                  <td className="px-2 md:px-6 gap-2 flex items-center">
                    {item.status === "Selesai" && !item.rated && (
                      <>
                        <button
                          className="text-white font-semibold bg-orange-400 p-2 rounded-lg"
                          onClick={() => handleContact(item.user._id)}
                        >
                          <HiAnnotation size={25} />
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && selectedPet && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-lg relative w-full max-w-lg">
            <button
              className="absolute top-3 right-4 p-2 text-gray-500 hover:text-gray-800 transition duration-300"
              onClick={toggleModalOpen}
            >
              <HiX className="text-2xl" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Detail Pesanan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border p-4 rounded-lg">
                  <div className="flex items-center">
                    <PhotoProvider>
                      <PhotoView src={selectedPet.photo}>
                        <img
                          className="w-20 h-20 rounded-full mr-4 cursor-pointer"
                          src={selectedPet.photo}
                          alt=""
                        />
                      </PhotoView>
                    </PhotoProvider>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {selectedPet.petName}
                      </h4>
                      <p className="text-lg font-bold text-white bg-blue-300 rounded-md p-1 mt-1">
                        {selectedPet.animalType}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    Layanan Dipesan
                  </h3>
                  <p className="text-lg text-gray-900">
                    {selectedService.servName}
                  </p>
                </div>
              </div>
              <div className="border p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Detail Peliharaan
                </h3>
                <ul className="list-none mb-0">
                  <li className="flex items-center mb-2">
                    <span className="w-24 text-lg text-gray-700">Umur:</span>
                    <span className="text-lg text-gray-900">
                      {selectedPet.age}
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <span className="w-24 text-lg text-gray-700">Bobot:</span>
                    <span className="text-lg text-gray-900">
                      {selectedPet.weight}
                    </span>
                  </li>
                  <li className="flex items-center mb-2">
                    <span className="w-24 text-lg text-gray-700">
                      Deskripsi:
                    </span>
                    <span className="text-lg text-gray-900">
                      {selectedPet.description}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Foto Dokumen Pendukung
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedPet.documents.map((url, i) => (
                    <PhotoProvider key={i}>
                      <PhotoView src={url}>
                        <img
                          className="w-full h-full rounded-lg"
                          src={url}
                          alt="foto"
                        />
                      </PhotoView>
                    </PhotoProvider>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
