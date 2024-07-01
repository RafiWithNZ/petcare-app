import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { BASE_URL, token } from "../../config";
import useFetchData from "../../hooks/useFetchData";
import { authContext } from "../../context/AuthContext.jsx";
import HashLoader from "react-spinners/HashLoader.js";
import { useNavigate } from "react-router-dom";

const ServiceCard2 = ({ item, data }) => {
  const { servName, description, price } = item;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user, role } = useContext(authContext);

  const { data: myPets} = useFetchData(`${BASE_URL}/my-pets`);

  const [formData, setFormData] = useState({
    caretaker: data._id,
    user: user?._id,
    orderDate: "",
    selectedPet: "",
    orderedService: item._id,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/my-orders/create-order`, {
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
      setLoading(false);
      toast.success(message);
      toggleModalOpen();
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  const toggleModalOpen = () => {
    if (role === "null") {
      toast.error("Anda harus memiliki akun");
      setTimeout(() => {
        navigate("/signup");
      }, 1000);
    } else {
      setIsModalOpen(!isModalOpen);
    }
  };

  return (
    <div className="bg-white max-w-md p-6 lg:p-8 shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-headingColor">{servName}</h2>
        <h2 className="text-lg font-semibold text-primaryColor">
          IDR{" "}
          {new Intl.NumberFormat("id-ID", {
            style: "decimal",
            currency: "IDR",
          }).format(price)}
        </h2>
      </div>
      <div className="flex h-[200px] gap-4 mt-2">
        <p
          className="text-sm leading-6 text-textColor overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      </div>
      <div className="flex justify-center">
        <button
          className="w-1/2 bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg py-3 mt-5"
          onClick={toggleModalOpen}
        >
          Pesan
        </button>
      </div>
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="modal w-1/2 max-w-[500px] items-center justify-center bg-white p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-0 right-0 p-6 text-red-700 text-2xl hover:text-red-500"
              onClick={toggleModalOpen}
            >
              x
            </button>
            <form onSubmit={submitHandler}>
              <div className="mb-4 flex-col">
                <label
                  className="block text-gray-700 text-xl font-bold mb-[30px]"
                  htmlFor="orderDate"
                >
                  Pilih Tanggal
                </label>
                <input
                  className="form__input mt-1"
                  type="date"
                  name="orderDate"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4 flex-col">
                <label
                  className="block text-gray-700 text-xl font-bold mb-[30px]"
                  htmlFor="orderDate"
                >
                  Pilih Hewan
                </label>
                <select
                  name="selectedPet"
                  className="form__input"
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled selected>
                    Pilih
                  </option>
                  {myPets?.map((pet, index) => (
                    <option key={index} value={pet._id}>
                      {pet.petName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center p-2 mt-10">
                <button
                  className="bg-primaryColor hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                  onClose={toggleModalOpen}
                >
                  {loading ? <HashLoader size={25} color="white" /> : "Pesan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard2;
