import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";
import Loading from "../../components/Loader/Loading";
import { HiX, HiAnnotation } from "react-icons/hi";
import { formateDate } from "../../utils/formateDate";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { toast } from "react-toastify";
import { authContext } from "../../context/AuthContext.jsx";

const MyOrders = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("activeOrders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [load, setLoad] = useState(false);

  const { user } = useContext(authContext);

  const toggleModalOpen = () => setIsModalOpen(!isModalOpen);

  const {
    data: orders,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/my-orders`);

  const filterOrders = () => {
    if (!orders) return [];
    return orders.filter((order) => {
      if (tab === "activeOrders") {
        return order.status === "Pending" || order.status === "Diproses";
      } else if (tab === "completedOrders") {
        return order.status === "Selesai" || order.status === "Dibatalkan";
      }
      return true;
    });
  };

  const filteredOrders = filterOrders();

  const statusCancelHandler = async (item) => {
    setLoad(true);
    try {
      const res = await fetch(`${BASE_URL}/my-orders/cancel/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { message } = await res.json();
      toast.success(message);
      setLoad(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const ratingHandler = async (item) => {
    try {
      const res = await fetch(`${BASE_URL}/my-orders/rated/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(message);
      navigate(`/rate/${item.caretaker._id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleContact = async (sellerId) => {
    const buyerId = user._id;
    const id = sellerId + buyerId;

    try {
      const res = await fetch(`${BASE_URL}/conversations/${id}`, {
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
    <div className="relative">
      <select
        value={tab}
        onChange={(e) => setTab(e.target.value)}
        className="absolute top-0 right-0 mt-2 mr-5 p-2 border border-primaryColor rounded-md"
      >
        <option value="activeOrders">Pesanan Aktif</option>
        <option value="completedOrders">Pesanan Selesai</option>
      </select>
      <h1 className="text-3xl font-bold mb-[50px]">Pesanan Saya</h1>
      <div
        className={`${
          window.innerWidth <= 768
            ? "max-w-[350px] overflow-x-scroll"
            : "max-w-full"
        }`}
      >
        <table className="w-full text-md text-gray-500">
          <thead className="text-xs text-gray-700 text-center uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Toko
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal
              </th>
              <th scope="col" className="px-6 py-3">
                Info
              </th>
              <th scope="col" className="px-6 py-3">
                Harga
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
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
            {!loading &&
              !error &&
              filteredOrders.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white border-b font-medium text-center"
                >
                  <th
                    scope="row"
                    className="flex px-2 md:px-6 py-4 font-medium whitespace-nowrap"
                  >
                    <img
                      src={item.caretaker.photo}
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                    <div className="pl-3 text-left">
                      <div className="text-base font-semibold">
                        {item.caretaker.name}
                      </div>
                      <div className="text-normal text-gray-500">
                        {item.caretaker.email}
                      </div>
                    </div>
                  </th>
                  <td className="px-2 md:px-6 py-4">
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
                    {item.orderedService.price}
                  </td>
                  <td className="px-2 md:px-6 py-4">{item.status}</td>
                  {tab === "activeOrders" && (
                    <td className="px-2 md:px-6 gap-2 flex">
                      {item.status === "Pending" && (
                        <>
                          <button
                            className="text-white p-2 rounded-md flex items-center gap-1 bg-red-500"
                            onClick={() => statusCancelHandler(item)}
                          >
                            <HiX className="w-2 h-2 md:w-5 md:h-5" /> Batalkan
                          </button>
                          <button
                            className="text-white font-semibold bg-orange-400 p-2 rounded-lg"
                            onClick={() => handleContact(item.caretaker._id)}
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
                            className="text-white p-2 rounded-md gap-1 bg-blue-500"
                            onClick={() => {
                              ratingHandler(item);
                            }}
                          >
                            Beri Rating
                          </button>
                          <button
                            className="text-white font-semibold bg-orange-400 p-2 rounded-lg"
                            onClick={() => handleContact(item.caretaker._id)}
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
