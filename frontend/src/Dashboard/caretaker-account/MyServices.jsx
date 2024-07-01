import { useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";
import ServiceCard from "../../components/Services/ServiceCard";
import { toast } from "react-toastify";
import Loading from "../../components/Loader/Loading";

const MyServices = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModalOpen = () => setIsModalOpen(!isModalOpen);

  const {
    data: myServ,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/my-services/`);

  const [formData, setFormData] = useState({
    servName: "",
    description: "",
    price: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    toggleModalOpen();

    try {
      const res = await fetch(`${BASE_URL}/my-services/create-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      toast.success(message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex align-middle justify-between mb-10">
        <h1 className="text-lg md:text-3xl font-bold">Info Layanan Saya</h1>
        <button
          className="p-2 md:w-[200px] bg-primaryColor text-sm md:text-[16px] leading-7 rounded-xl text-white font-semibold"
          onClick={toggleModalOpen}
          disabled={isModalOpen}
        >
          Tambah Layanan Toko
        </button>
      </div>
      {loading && <Loading />}
      {!loading && !error && myServ.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {myServ.map((services) => (
            <ServiceCard key={services._id} services={services} />
          ))}
        </div>
      ) : null}

      {!loading && myServ.length === 0 ? (
        <h2
          className="mt-5 text-center leading-7
      text-[20px] font-semibold text-primaryColor"
        >
          Belum menambahkan Service
        </h2>
      ) : null}

      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="modal w-1/2 max-w-[500px] bg-white p-6 rounded-lg shadow-lg translate-y-[-10%]">
            <h2 className="text-3xl font-bold mb-5">Tambah Service</h2>
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor=""
                >
                  Nama Layanan
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="servName"
                  type="text"
                  name="servName"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="animal-type"
                >
                  Tarif Layanan
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="price"
                  type="text"
                  name="price"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Deskripsi Layanan
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  name="description"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={toggleModalOpen}
                >
                  Batal
                </button>
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                  onClose={toggleModalOpen}
                >
                  Tambah Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyServices;
